#!/bin/bash
docker-compose down
docker system prune -f --all
docker rmi auth_client:latest
docker build -f ./Dockerfile -t auth_client:latest .
docker-compose down
docker-compose up -d
docker logs -f auth_client
