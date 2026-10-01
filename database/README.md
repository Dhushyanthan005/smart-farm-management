# DairyFlow Database Management

This directory manages the relational database lifecycle for DairyFlow using PostgreSQL.

## Directory Structure

```
database/
├── migrations/         # Versioned SQL migration scripts (Flyway compatible)
│   └── V1__init_auth_rbac.sql
├── seeds/              # Initial seed data for development and testing
│   └── V1_1__seed_roles_permissions.sql
├── schema/             # Schema architecture and design documentation
│   └── schema-overview.md
└── README.md
```

## Running Migrations Locally

### Via Docker Compose (Automated on first boot)
When `docker compose up -d` is executed, any scripts in `database/migrations` mounted to `/docker-entrypoint-initdb.d` will be executed in order on fresh database initialization.

### Via Backend Spring Boot / Flyway
Spring Boot is configured with Flyway to automatically apply migrations located in `classpath:db/migration` or mounted migration directories upon application startup.

### Direct psql Execution
```bash
# Connect to PostgreSQL
psql -h localhost -p 5432 -U dairyflow_user -d dairyflow_db

# Execute migrations manually
\i database/migrations/V1__init_auth_rbac.sql
\i database/seeds/V1_1__seed_roles_permissions.sql
```
