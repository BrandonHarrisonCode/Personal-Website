#!/bin/bash

###  This script is designed to automatically deploy the website to AWS
aws s3 sync public_html s3://brandonharrisoncode.com
