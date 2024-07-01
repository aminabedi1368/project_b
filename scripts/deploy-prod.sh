#!/bin/bash

# Build Docker images
docker build -t nest-app:latest .

# Apply Kubernetes configurations
kubectl apply -f k8s/mongo-pvc.yaml
kubectl apply -f k8s/redis-pvc.yaml
kubectl apply -f k8s/mongo-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/nest-app-deployment.yaml
