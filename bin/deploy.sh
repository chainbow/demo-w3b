#!/bin/bash

docker system prune -f --all
docker compose down
docker build -f ./Dockerfile -t demo-w3b:latest .
docker network create shared
docker compose down
docker compose up -d
docker logs -f demo-w3b
