# DairyFlow - Smart Dairy Farm Management System

[![DairyFlow CI](https://github.com/dairyflow/dairyflow/actions/workflows/ci.yml/badge.svg)](https://github.com/dairyflow/dairyflow/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-21%2B-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3%2B-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-15%20App%20Router-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red.svg)](https://redis.io/)

DairyFlow is a modern, production-grade **Smart Dairy Farm Management System** designed to streamline dairy operations, herd lifecycle tracking, milk yields, veterinary health records, breeding, logistics, inventory, and customer subscriptions.

---

## 1. Technology Stack

### Backend
- **Language**: Java 21+ LTS
- **Framework**: Spring Boot 3.x
- **Build Tool**: Apache Maven
- **Security**: Spring Security 6 with stateless JWT and Role-Based Access Control (RBAC)
- **Persistence**: Spring Data JPA & Hibernate ORM
- **Database**: PostgreSQL 16+
- **Caching**: Redis 7+
- **Storage Abstraction**: S3-compatible file storage (`FileStorageService`)
- **API Documentation**: SpringDoc OpenAPI 3 / Swagger UI
- **Testing**: JUnit 5, Mockito, Spring Boot Test

### Frontend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS & Shadcn/ui Design Primitives
- **Server State Management**: TanStack Query (React Query)
- **Forms & Validation**: React Hook Form with Zod schemas
- **Data Visualization**: Recharts
- **Icons**: Lucide React

---

## 2. Architecture

DairyFlow is engineered as a **Modular Monolith**:
- Single deployable backend artifact with strictly decoupled domain packages.
- Follows **SOLID** principles with interface segregation and dependency inversion.
- Ready for future extraction into microservices, IoT ingestion (MQTT), and AI forecasting (Python / FastAPI).

```
                      +-----------------------------+
                      |       NEXT.JS FRONTEND      |
                      |  (App Router + TS + Shadcn) |
                      +--------------+--------------+
                                     |
                                     | HTTPS / REST JSON (/api/v1/*)
                                     v
                      +-----------------------------+
                      |       SPRING BOOT API       |
                      |        (Modular Core)       |
                      +--------------+--------------+
                                     |
        +----------------------------+----------------------------+
        |                            |                            |
        v                            v                            v
+-----------------+          +-----------------+          +-----------------+
|   PostgreSQL    |          |   Redis Cache   |          | Object Storage  |
|  (Relational)   |          | (Session/Queue) |          | (S3-Compatible) |
+-----------------+          +-----------------+          +-----------------+
```

Detailed architectural diagrams and domain boundaries are documented in [`docs/architecture/`](docs/architecture/).

---

## 3. Repository Structure

```
dairyflow/
├── frontend/             # Next.js App Router frontend application
├── backend/              # Spring Boot Java 21 modular monolith backend
├── database/             # PostgreSQL migrations, seeds, and schema specs
├── infrastructure/       # Dockerfiles and orchestration manifests
├── docs/                 # Architectural guidelines, API specs, and dev guides
├── scripts/              # Developer environment setup scripts
├── .github/              # GitHub Actions CI/CD workflows
├── docker-compose.yml    # PostgreSQL and Redis development stack
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore specification
├── README.md             # Project documentation
└── LICENSE               # MIT License
```

---

## 4. How to Run Locally

### 4.1 Prerequisites
- JDK 21+ installed and on `PATH`
- Maven 3.9+ installed
- Node.js 20+ and npm 10+ installed
- Docker (optional but recommended for running PostgreSQL and Redis)

### 4.2 Start Supporting Services (PostgreSQL & Redis)
Copy the example environment file:
```bash
cp .env.example .env
```

Start PostgreSQL (port 5432) and Redis (port 6379) via Docker Compose:
```bash
docker compose up -d
```
*(If running natively without Docker, ensure PostgreSQL has database `dairyflow_db` and user `dairyflow_user` with password `dairyflow_secret_password` as configured in `.env`)*

### 4.3 Start the Backend API
```bash
cd backend
mvn spring-boot:run
```
- API Base URL: `http://localhost:8080/api/v1`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON Spec: `http://localhost:8080/v3/api-docs`

### 4.4 Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
- Access the web application at: `http://localhost:3000`

---

## 5. Environment Variables

The project uses `.env` for local configuration. Reference variables from [`.env.example`](.env.example):

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL JDBC Connection URL | `jdbc:postgresql://localhost:5432/dairyflow_db` |
| `DATABASE_USERNAME` | Database username | `dairyflow_user` |
| `DATABASE_PASSWORD` | Database password | `dairyflow_secret_password` |
| `JWT_SECRET` | 256-bit secret key for HMAC-SHA256 | (Base64 Secret) |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `S3_ENDPOINT` | Object storage endpoint | `http://localhost:9000` |
| `S3_ACCESS_KEY` | Storage access key | `minioadmin` |
| `S3_SECRET_KEY` | Storage secret key | `minioadmin` |
| `S3_BUCKET` | S3 bucket name | `dairyflow-storage` |
| `NEXT_PUBLIC_API_URL` | Frontend API client base URL | `http://localhost:8080/api/v1` |

---

## 6. Git Workflow

- **Main Branch**: `main` (Production)
- **Integration Branch**: `develop`
- **Feature Branches**: `feat/<module-name>-<description>`
- **Hotfix Branches**: `fix/<module-name>-<description>`

All commits follow [Conventional Commits](https://www.conventionalcommits.org/):
```bash
git commit -m "feat(cows): add ear tag uniqueness validation"
```

---

## 7. Phased Implementation Roadmap

Development is planned in 19 disciplined, module-by-module phases:

1. **PHASE 1**: Project Setup & Architecture Skeleton *(Current)*
2. **PHASE 2**: Database & Common Infrastructure
3. **PHASE 3**: Authentication + RBAC
4. **PHASE 4**: Cow Management
5. **PHASE 5**: Milk Production
6. **PHASE 6**: Health + Vaccination
7. **PHASE 7**: Breeding + Pregnancy
8. **PHASE 8**: Feed + Inventory
9. **PHASE 9**: Staff
10. **PHASE 10**: Customers + Subscriptions
11. **PHASE 11**: Orders + Payments + Delivery
12. **PHASE 12**: Finance
13. **PHASE 13**: Notifications
14. **PHASE 14**: Reports
15. **PHASE 15**: Dashboard
16. **PHASE 16**: Testing
17. **PHASE 17**: Docker + Deployment
18. **PHASE 18**: IoT
19. **PHASE 19**: AI/ML
