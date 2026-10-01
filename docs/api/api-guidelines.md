# DairyFlow - REST API Guidelines

## 1. URI Conventions & Versioning

All API endpoints must be explicitly versioned under `/api/v1/`:

```
/api/v1/auth
/api/v1/users
/api/v1/cows
/api/v1/milk
/api/v1/health
/api/v1/vaccinations
/api/v1/breeding
/api/v1/feed
/api/v1/inventory
/api/v1/customers
/api/v1/subscriptions
/api/v1/orders
/api/v1/deliveries
/api/v1/payments
/api/v1/finance
/api/v1/notifications
/api/v1/reports
/api/v1/dashboard
```

## 2. HTTP Method Semantics

| Verb | Semantics | Success Code |
|---|---|---|
| `GET` | Retrieve resource(s) (idempotent, safe) | `200 OK` |
| `POST` | Create a new resource or invoke business action | `201 Created` or `200 OK` |
| `PUT` | Complete replacement / update of a resource | `200 OK` |
| `PATCH` | Partial modification of a resource | `200 OK` |
| `DELETE` | Remove or archive a resource | `204 No Content` or `200 OK` |

## 3. Response Contracts

### 3.1 Standard Success Envelope
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": { ... },
  "timestamp": "2026-10-01T21:15:00.000Z"
}
```

### 3.2 Paginated Envelope (`PageResponse<T>`)
```json
{
  "content": [ ... ],
  "page": 0,
  "size": 20,
  "totalElements": 150,
  "totalPages": 8,
  "first": true,
  "last": false
}
```

### 3.3 Standard Error Envelope (`ErrorResponse`)
All errors intercepted by `@RestControllerAdvice` return:
```json
{
  "timestamp": "2026-10-01T21:15:00.000Z",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed for request parameters",
  "path": "/api/v1/cows",
  "details": [
    {
      "field": "tagNumber",
      "rejectedValue": "",
      "message": "Tag number cannot be blank"
    }
  ]
}
```

## 4. Input Validation Rules

- Validation MUST occur at the DTO layer using Jakarta Bean Validation (`@NotNull`, `@NotBlank`, `@Size`, `@Positive`, `@PastOrPresent`).
- Controllers must annotate request bodies with `@Valid`.
- Never expose stack traces, database query strings, or internal file paths to clients.
