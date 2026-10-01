# DairyFlow Infrastructure

This directory contains container definitions, orchestration manifests, and infrastructure configurations for DairyFlow.

## Directory Structure

```
infrastructure/
└── docker/
    ├── backend/
    │   └── Dockerfile       # Spring Boot multi-stage Dockerfile (Eclipse Temurin 21)
    └── frontend/
        └── Dockerfile       # Next.js standalone multi-stage Dockerfile (Node 20 Alpine)
```

## Running Supporting Services

PostgreSQL and Redis can be started locally via the root `docker-compose.yml`:

```bash
docker compose up -d
```

To stop:
```bash
docker compose down
```

To reset data volumes:
```bash
docker compose down -v
```
