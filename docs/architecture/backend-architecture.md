# DairyFlow - Backend Architecture

## 1. Technology Overview

- **Language & Runtime**: Java 21+ LTS
- **Core Framework**: Spring Boot 3.x
- **Build System**: Apache Maven
- **Persistence**: Spring Data JPA / Hibernate ORM
- **Database Engine**: PostgreSQL 16+
- **Caching & Ephemeral Store**: Redis 7+
- **Security**: Spring Security 6 with stateless JWT Bearer tokens and custom Role-Based Access Control (RBAC)
- **API Documentation**: SpringDoc OpenAPI 3 / Swagger UI
- **Code Generation & Boilerplate Reduction**: Project Lombok
- **Validation**: Jakarta Bean Validation (`hibernate-validator`)

## 2. Layered Domain Architecture

Each domain module under `com.dairyflow.modules.<module_name>` implements strict separation of concerns:

```
[ HTTP Request ]
       │
       ▼
Controller (@RestController)
  └── Translates HTTP, validates incoming DTOs (@Valid)
       │
       ▼
Service Interface & Implementation (@Service)
  └── Orchestrates domain logic, transactional boundaries (@Transactional)
       │
       ├── Mapper (@Component) ──────────> Entity <──> DTO
       │
       ▼
Repository Interface (JpaRepository)
  └── Encapsulates database queries and persistence
       │
       ▼
[ PostgreSQL Database ]
```

## 3. Module Inventory

The backend modular monolith consists of 19 isolated domain modules:

| # | Module | Scope & Core Responsibility |
|---|---|---|
| 1 | **auth** | Login, JWT creation, token refresh, password resets |
| 2 | **users** | User profiles, account status, credential management |
| 3 | **cows** | Animal registration, ear-tag IDs, breed, lifecycle, lineage |
| 4 | **milk** | Morning/evening milk collection, yields, quality (fat/SNF) |
| 5 | **health** | Symptoms, diagnoses, veterinary visits, medications |
| 6 | **vaccinations**| Vaccine scheduling, doses, batch tracking, due dates |
| 7 | **breeding** | Heat cycles, artificial insemination (AI), pregnancy, calving |
| 8 | **feed** | Feed formulations, daily consumption logs, nutritional costs |
| 9 | **inventory** | Stock levels, feed bags, medicines, equipment, reorder alerts |
| 10| **staff** | Farm workers, veterinary staff, shifts, attendance, roles |
| 11| **customers** | B2C and B2B customer profiles, billing/delivery addresses |
| 12| **subscriptions**| Recurring milk delivery plans, daily pause/resume, schedules |
| 13| **orders** | Ad-hoc and subscription-generated orders, item lines |
| 14| **deliveries** | Route assignments, delivery agents, real-time dropoff status |
| 15| **payments** | Payment receipts, cash on delivery (COD), digital payouts |
| 16| **finance** | Incomes, operational expenditures, profit and loss ledgers |
| 17| **notifications**| In-app alerts, push notifications, external gateway hooks |
| 18| **reports** | Production summaries, financial aggregates, CSV/PDF exports |
| 19| **dashboard** | Real-time farm KPIs, herd statistics, milk volume graphs |

## 4. Shared Infrastructure (`com.dairyflow.common`)

- **`exception`**: Centralized `@RestControllerAdvice` converting domain and runtime exceptions to structured error envelopes.
- **`response`**: Standardized generic `ApiResponse<T>` and paginated `PageResponse<T>` payloads.
- **`audit`**: JPA Auditing base classes (`AuditableEntity`) for automatic capture of `created_at`, `updated_at`, `created_by`, `updated_by`, plus persistent audit log service.
- **`pagination`**: Clean DTOs for page, size, and sorting controls.
- **`validation`**: Custom validation annotations and validation group markers.
- **`util`**: Date utilities, string formatters, and global constants.

## 5. Security & Authorization

- Stateless JWT tokens (HMAC-SHA256 signature).
- Standardized RBAC with roles:
  - `ROLE_OWNER`
  - `ROLE_ADMIN`
  - `ROLE_MANAGER`
  - `ROLE_VETERINARIAN`
  - `ROLE_WORKER`
  - `ROLE_DELIVERY_STAFF`
  - `ROLE_CUSTOMER`
- Method-level authorization via `@PreAuthorize("hasAuthority('COW_WRITE')")` backed by `RolePermissionEvaluator`.
