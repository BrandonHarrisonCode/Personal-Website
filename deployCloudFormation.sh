#!/usr/bin/bash

# Not sure if setting this is necessary. TravisCI might do this be default.
set -e

if [ -z ${TRAVIS_BRANCH} ]
then
    echo "This script is for TravisCI deployment only!  Exiting..."
    exit -1
fi

# This sets up environment variables for the rest of the build/deploy cycle.
if [ ${TRAVIS_BRANCH} == "master" ]
then
  WEBSITE_DOMAIN="brandonharrisoncode.com"
  STACK_NAME="brandonharrisoncode"
else
  WEBSITE_DOMAIN="${TRAVIS_BRANCH}.com"
  STACK_NAME="${TRAVIS_BRANCH}"
fi

echo This build is being to stack name ${STACK_NAME} with WEBSITE_DOMAIN set to ${WEBSITE_DOMAIN}.

# check the aws-cli version in case something breaks
aws --version

# Follow the CloudFormation deploy steps using aws-sam-cli and aws-cli
aws cloudformation deploy --template-file cloudformation.yml --stack-name ${STACK_NAME} --capabilities CAPABILITY_IAM --region us-east-1 --parameter-overrides websiteDomain=${WEBSITE_DOMAIN}

# Output info about the branch and domain name.
echo Done!
