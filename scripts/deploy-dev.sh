#!/bin/bash

# Build Docker images
docker-compose -f docker-compose.yml build

# Start services with Docker Compose
docker-compose -f docker-compose.yml up -d
