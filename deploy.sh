#!/bin/bash
###  This script is designed to automatically deploy the website to AWS

source .env
aws s3 sync public_html s3://brandonharrisoncode.com
aws cloudfront create-invalidation --distribution-id $CDN_DISTRIBUTION_ID --paths "/*"
