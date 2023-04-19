#!/bin/bash

docker system prune -f --all
git pull --autostash
docker-compose down
docker-compose up -d
docker logs -f demo-w3b
