import os
import glob
import pathlib
import time
import mimetypes

import boto3

TRAVIS_BRANCH = os.environ.get('TRAVIS_BRANCH')
cloudformation = boto3.client('cloudformation')
cloudfront = boto3.client('cloudfront')
s3 = boto3.resource('s3')


def current_milli_time():
    return int(round(time.time() * 1000))


def get_stacks(nextToken=None):
    stacks = []
    if nextToken is None:
        response = cloudformation.list_stacks(
            StackStatusFilter=[
                'CREATE_COMPLETE',
            ]
        )
        nextToken = response.get('NextToken')
        for stack in response['StackSummaries']:
            stacks.append(stack)

    while nextToken is not None:
        response = cloudformation.list_stacks(
            NextToken=nextToken,
            StackStatusFilter=[
                'CREATE_COMPLETE',
            ]
        )
        nextToken = response.get('NextToken')
        for stack in response['StackSummaries']:
            stacks.append(stack)

    return stacks


def stack_exists(stack_name):
    stacks = get_stacks()
    stack_names = [i['StackName'] for i in stacks]
    return stack_name in stack_names


def create_stack(stack_name, website_domain):
    if stack_exists(stack_name):
        print('Stack already exists.  Continuing...')
        return True

    print('Creating stack...')
    with open('cloudformation.yml', 'r') as file:
        response = cloudformation.create_stack(
            StackName=stack_name,
            TemplateBody=file.read(),
            TimeoutInMinutes=45,
            Parameters=[
                {
                    'ParameterKey': 'websiteDomain',
                    'ParameterValue': website_domain,
                },
            ],
            Capabilities=[
                'CAPABILITY_IAM',
            ],
            Tags=[
                {
                    'Key': 'Project',
                    'Value': 'Personal Website'
                },
            ],
        )

    waiter = cloudformation.get_waiter('stack_create_complete')
    waiter.wait(
        StackName=stack_name,
    )

    if stack_exists(stack_name):
        print('Stack created.')
        return True
    else:
        print('Stack creation failed.  Exiting...')
        return False


def guess_mimetype(filename):
    mimetype, _ = mimetypes.guess_type(filename)
    return mimetype


def get_aws_filenames(raw):
    path = pathlib.Path(raw)
    filename = str(path)
    if not path.is_file():
        return None, None, None
    path = pathlib.Path(*path.parts[1:])
    keyname = str(path)

    mimetype = guess_mimetype(filename)
    return filename, keyname, mimetype



def syncS3(website_domain):
    TopLevelBucket = s3.Bucket(website_domain)
    print('Syncing to S3 bucket {}...'.format(website_domain))

    items = []
    for to_upload in glob.iglob('public_html/**', recursive=True):
        filename, keyname, mimetype = get_aws_filenames(to_upload)
        if filename is None or keyname is None or mimetype is None:
            continue

        TopLevelBucket.upload_file(
            Filename=filename,
            Key=keyname,
            ExtraArgs={
                "ContentType": mimetype
            }
        )
        items.append('/' + keyname)
        print('  Uploaded {}...'.format(keyname))
    return items


def get_distribution(website_domain):
    all_distributions = []
    marker = None
    response = cloudfront.list_distributions()['DistributionList']
    marker = response.get('NextMarker')
    for distribution in response.get('Items'):
        all_distributions.append(distribution)
    while marker is not None:
        response = cloudfront.list_distributions(Marker=marker)['DistributionList']
        marker = response.get('NextMarker')
        for distribution in response.get('Items'):
            all_distributions.append(distribution)

    for distribution in all_distributions:
        if website_domain in distribution['Aliases']['Items']:
            return distribution['Id']


def invalidate_distribution(website_domain, items):
    id = get_distribution(website_domain)
    print('Invalidating CloudFront distribution {} with id {}...'.format(website_domain, id))

    response = cloudfront.create_invalidation(
        DistributionId=id,
        InvalidationBatch={
            'Paths': {
                'Quantity': len(items),
                'Items': items,
            },
            'CallerReference': str(current_milli_time())
        }
    )


if __name__ == '__main__':
    print('TRAVIS_BRANCH is {}'.format(TRAVIS_BRANCH))
    if TRAVIS_BRANCH is None:
        print('This script is for TravisCI deployment only!  Exiting...')
    elif TRAVIS_BRANCH == 'master':
        print('Build for Master branch.  Nothing to do.')
    else:
        website_domain = TRAVIS_BRANCH + '.com'
        stack_name = TRAVIS_BRANCH
        if create_stack(stack_name, website_domain):
            items = syncS3(website_domain)
            invalidate_distribution(website_domain, items)
            print('Done!')
