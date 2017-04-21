#!/bin/bash

echo "Checking out deploy branch."
git checkout deploy
git branch 

echo "Merging changes from Master."
git pull origin master

echo "Pushing and deploying to heroku."
git push origin deploy

echo "Returning to master branch."
git checkout master
