import os
import glob
import pathlib
import boto3

TRAVIS_BRANCH = os.environ.get('TRAVIS_BRANCH')
cloudformation = boto3.client('cloudformation')
s3 = boto3.resource('s3')


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


def syncS3(website_domain):
    TopLevelBucket = s3.Bucket(website_domain)
    print('Syncing to S3 bucket {}...'.format(website_domain))

    for file in glob.iglob('public_html/**', recursive=True):
        path = pathlib.Path(file)
        filename = str(path)
        if not path.is_file():
            continue
        path = pathlib.Path(*path.parts[1:])
        keyname = str(path)
        TopLevelBucket.upload_file(filename, keyname)
        print('  Uploaded {}...'.format(keyname))


def invalidate_distribution(website_domain):
    print('Invalidating CloudFront distribution {}...'.format(website_domain))
    pass


if __name__ == '__main__':
    print('TRAVIS_BRANCH is {}'.format(TRAVIS_BRANCH))
    if TRAVIS_BRANCH is None:
        print('This script is for TravisCI deployment only!  Exiting...')
    else:
        website_domain = 'brandonharrisoncode.com' if TRAVIS_BRANCH == 'master' else TRAVIS_BRANCH + '.com'
        stack_name = 'brandonharrisoncode' if TRAVIS_BRANCH == 'master' else TRAVIS_BRANCH
        if create_stack(stack_name, website_domain):
            syncS3(website_domain)
            invalidate_distribution(website_domain)
