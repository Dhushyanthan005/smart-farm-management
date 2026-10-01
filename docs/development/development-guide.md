# DairyFlow - Development Guide

## 1. Prerequisites

Ensure you have the following installed on your machine:
- **Java**: JDK 21+ LTS (Tested on OpenJDK / Eclipse Temurin / Oracle JDK)
- **Build Tool**: Apache Maven 3.9+
- **Node.js**: Node 20+ LTS or 22+ (npm 10+)
- **Containerization**: Docker & Docker Compose (Optional for local execution, recommended for database services)
- **Database (if running without Docker)**: PostgreSQL 16+ running on port 5432
- **Cache (if running without Docker)**: Redis 7+ running on port 6379

---

## 2. Quick Start

### Step 1: Clone and Configure Environment
```bash
git clone <repository-url> dairyflow
cd dairyflow
cp .env.example .env
```

### Step 2: Start Infrastructure Services
Using Docker Compose:
```bash
docker compose up -d
```
Verify containers are healthy:
```bash
docker compose ps
```

### Step 3: Run Backend API
```bash
cd backend
mvn spring-boot:run
```
The Spring Boot backend will start on `http://localhost:8080`.
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

### Step 4: Run Frontend Application
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
The Next.js frontend will launch on `http://localhost:3000`.

---

## 3. Git Workflow & Branching Strategy

- **`main`**: Production-ready branch. Direct pushes prohibited.
- **`develop`**: Primary integration branch for completed modules.
- **Feature Branches**: `feat/<module-name>-<feature-description>` (e.g. `feat/cows-ear-tag-search`)
- **Bugfix Branches**: `fix/<module-name>-<issue-description>` (e.g. `fix/auth-token-expiry`)

### Commit Message Conventions
Follow Conventional Commits:
- `feat(cows): implement cow registration endpoint`
- `fix(auth): correct refresh token revocation condition`
- `docs(api): document milk collection DTO contracts`
- `refactor(common): streamline global exception handling`

---

## 4. Phase-by-Phase Roadmap

| Phase | Milestone | Focus Area |
|---|---|---|
| **Phase 1** | Project Setup & Architecture | Folder structure, modular monolith baseline, frontend skeleton, docs |
| **Phase 2** | Database & Common Infrastructure | Base entities, audit logs, Flyway migrations, Redis config |
| **Phase 3** | Authentication & RBAC | JWT auth, user profiles, login UI, protected routes |
| **Phase 4** | Cow Management | Animal registration, ear tags, status, lineage |
| **Phase 5** | Milk Production | Morning/evening collection, bulk storage, yield analytics |
| **Phase 6** | Health & Vaccinations | Medical histories, prescriptions, vaccine due schedules |
| **Phase 7** | Breeding & Pregnancy | Heat cycles, artificial insemination, calving timeline |
| **Phase 8** | Feed & Inventory | Rations, stock deduction, low inventory reorder triggers |
| **Phase 9** | Staff Management | Worker shifts, veterinary attendance, permissions |
| **Phase 10**| Customers & Subscriptions | Consumer profiles, recurring daily milk delivery plans |
| **Phase 11**| Orders, Delivery & Payments | Order lifecycle, route delivery assignment, cash/online payments |
| **Phase 12**| Finance & Accounting | Income, farm expenditures, profit/loss balance sheets |
| **Phase 13**| Notifications | In-app alerts, alerts bus, future external notifications |
| **Phase 14**| Reports & Analytics | Exportable production and financial reports (PDF/Excel) |
| **Phase 15**| Dashboard & KPIs | High-level metrics, herd health summaries, live milk trends |
| **Phase 16**| Comprehensive Testing | Unit, integration, slice, and end-to-end tests |
| **Phase 17**| Deployment & CI/CD | Docker images, Kubernetes/Cloud configurations |
| **Phase 18**| IoT Integration | MQTT brokers, automated milking parlor sensors, RFID tags |
| **Phase 19**| AI & Machine Learning | Python/FastAPI microservice for yield & mastitis predictions |
