#!/bin/bash

read VERSION

docker build -t juancarlosf2/lireddit:$VERSION .
docker push juancarlosf2/lireddit: $VERSION
ssh root@206.189.195.126 "docker pull juancarlosf2/lireddit:$VERSION && docker tag juancarlosf2/lireddit:$VERSION dokku/api:$VERSION && dokku tags:deploy api $VERSION"