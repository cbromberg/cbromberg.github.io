#!/bin/bash

echo "Committing with messsage $@"

git add . -A
git commit -m "Done $@"

git pull
git push
