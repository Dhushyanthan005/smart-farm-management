# DairyFlow Backend

Modular Monolith backend built with Java 21+ and Spring Boot 3.x for the DairyFlow Smart Dairy Farm Management System.

## Architecture

- **Domain-Oriented Modular Monolith**: Located under `com.dairyflow.modules.*`.
- **Common Utilities & Infrastructure**: Located under `com.dairyflow.common.*` and `com.dairyflow.infrastructure.*`.
- **Security**: Stateless JWT-based authentication with Role-Based Access Control (RBAC) in `com.dairyflow.security`.

## Modules

1. `auth`
2. `users`
3. `cows` (Reference architecture implementation)
4. `milk`
5. `health`
6. `vaccinations`
7. `breeding`
8. `feed`
9. `inventory`
10. `staff`
11. `customers`
12. `subscriptions`
13. `orders`
14. `deliveries`
15. `payments`
16. `finance`
17. `notifications`
18. `reports`
19. `dashboard`

## Running the Application

Ensure PostgreSQL and Redis are running:
```bash
docker compose up -d
```

Run with Maven:
```bash
mvn spring-boot:run
```

Run tests:
```bash
mvn test
```
