# DairyFlow - Database Design Specification

## 1. Engine & Conventions

- **Database Engine**: PostgreSQL 16+
- **Case Conventions**: `snake_case` for all table and column identifiers. Plural nouns for table names (`users`, `cows`, `milk_records`).
- **Primary Keys**: UUIDv4 (`UUID` column with default `uuid_generate_v4()`) for business domain entities; `BIGSERIAL` for system dictionary/lookup tables.
- **Timestamps**: All temporal columns use `TIMESTAMP WITH TIME ZONE` (`timestamptz`).
- **Audit Columns**: Standard auditable entities must include `created_at`, `updated_at`, `created_by`, `updated_by`.

## 2. Relational Integrity

- **Foreign Keys**: Enforced on all relationships with explicit `ON DELETE` rules (`RESTRICT` default for financial/inventory data; `CASCADE` strictly for dependent child associations like `user_roles`).
- **Unique Constraints**: Unique business keys (e.g., cow ear tag number, user email, invoice number) must be backed by unique indexes.
- **Enums**: Modeled as `VARCHAR(30)` columns accompanied by database-level `CHECK` constraints to ensure schema extensibility without database migrations blocking table locks.

## 3. Core Initial Schema (V1)

```
+--------------------+            +-----------------------+            +---------------------+
|       users        |            |      user_roles       |            |        roles        |
+--------------------+            +-----------------------+            +---------------------+
| id (UUID, PK)      | <--------- | user_id (UUID, FK)    | ---------> | id (BIGINT, PK)     |
| username (VARCHAR) |            | role_id (BIGINT, FK)  |            | name (VARCHAR, UQ)  |
| email (VARCHAR, UQ)|            +-----------------------+            | description         |
| password_hash      |                                                 +----------+----------+
| first_name         |                                                            |
| last_name          |            +-----------------------+                       |
| phone_number       |            |   role_permissions    |                       |
| status (CHECK)     |            +-----------------------+                       |
| created_at (TZ)    |            | role_id (BIGINT, FK)  | <---------------------+
| updated_at (TZ)    |            | permission_id (FK)    | --------+
+---------+----------+            +-----------------------+         |
          |                                                         v
          |                       +-----------------------+    +----+----------------+
          |                       |     refresh_tokens    |    |     permissions     |
          |                       +-----------------------+    +---------------------+
          +---------------------> | id (UUID, PK)         |    | id (BIGINT, PK)     |
                                  | user_id (UUID, FK)    |    | name (VARCHAR, UQ)  |
                                  | token_hash            |    | module (VARCHAR)    |
                                  | expires_at (TZ)       |    +---------------------+
                                  | revoked (BOOL)        |
                                  +-----------------------+
```
