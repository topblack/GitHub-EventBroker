#!/bin/bash
docker run --name github-eventbroker -p 8081:8081 --restart=always qinling/github-eventbroker:latest
