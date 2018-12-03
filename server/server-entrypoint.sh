#/bin/sh
set -e

cd /git 
rm -fr .terraform
terraform init 
cd -
node ./server/index.js