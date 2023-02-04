#!/bin/bash
docker system prune -f --all
docker-compose down
docker build -f ./Dockerfile -t auth_client:latest .
docker network create shared
docker-compose down
docker-compose up -d
docker logs -f auth_client
