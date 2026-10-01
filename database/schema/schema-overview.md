# DairyFlow Database Schema Design Guidelines

## Design Principles

1. **Identifier Strategy**:
   - Master entities (Users, Cows, Orders, etc.) use UUIDv4 (`UUID` type in PostgreSQL, `java.util.UUID` in Java) to prevent sequential enumeration attacks and ease potential distributed migration.
   - Reference/Lookup tables (Roles, Permissions) use `BIGSERIAL` / `BIGINT` for compact foreign keys.

2. **Temporal Tracking & Audit**:
   - Every domain entity has `created_at` and `updated_at` timestamps using `TIMESTAMP WITH TIME ZONE` (`timestamptz`).
   - Audit logs capture state transitions, user actor IDs, and IP addresses.

3. **Referential Integrity & Constraints**:
   - Foreign keys with appropriate delete actions (`ON DELETE RESTRICT` for financial and inventory relations; `ON DELETE CASCADE` for child join tables).
   - Domain-level constraints (`CHECK` constraints for status enums).

4. **Module Migration Plan**:
   - `V1`: Auth & RBAC (Users, Roles, Permissions, Refresh Tokens, Audit Logs)
   - `V2`: Cows & Livestock Profiles
   - `V3`: Milk Production & Yield Logs
   - `V4`: Health, Treatments & Vaccinations
   - `V5`: Breeding, Insemination & Calving
   - `V6`: Feed Rations & Inventory Batches
   - `V7`: Staff & Shifts
   - `V8`: Customers & Subscriptions
   - `V9`: Orders, Deliveries & Payments
   - `V10`: Financial Ledgers & Accounts
