#!/usr/bin/env bash
set -e

echo "=== Initializing DairyFlow Development Environment ==="

# 1. Environment file check
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ".env created."
else
    echo ".env already exists."
fi

# 2. Start database & cache
if command -v docker >/dev/null 2>&1; then
    echo "Starting infrastructure containers with docker compose..."
    docker compose up -d
else
    echo "Warning: docker is not installed. Please run PostgreSQL and Redis manually."
fi

echo ""
echo "DairyFlow setup initialized."
echo "Backend:  cd backend && mvn spring-boot:run"
echo "Frontend: cd frontend && npm run dev"
