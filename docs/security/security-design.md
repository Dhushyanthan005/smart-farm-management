# DairyFlow - Security Architecture & Design

## 1. Authentication Flow (JWT-Based)

```
[ Frontend Client ] ───── (POST /api/v1/auth/login) ─────> [ Backend Security ]
                                                                   │
                                                                   ▼
                                                            CustomUserDetailsService
                                                            (Verifies BCrypt hash)
                                                                   │
                                                                   ▼
[ Frontend Client ] <──── { accessToken, refreshToken } ─── JwtService (Signs HMAC-SHA256)
```

1. **Access Tokens**: Short-lived JWTs (e.g., 15–60 minutes) containing Subject (`userId`), Username, and Granted Authorities/Roles.
2. **Refresh Tokens**: Long-lived secure opaque tokens stored hashed in the `refresh_tokens` database table with instant revocation support.
3. **Stateless Enforcement**: `JwtAuthenticationFilter` intercepts requests, extracts the `Authorization: Bearer <token>` header, validates the signature, and establishes the `SecurityContextHolder`.

## 2. Role-Based Access Control (RBAC)

DairyFlow operates a 7-tier hierarchical role structure:

```
                  ┌──────────────┐
                  │    OWNER     │ (Complete Farm Operations & Financial Authority)
                  └──────┬───────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌───────────┐   ┌───────────┐   ┌──────────────┐
   │   ADMIN   │   │  MANAGER  │   │ VETERINARIAN │
   └───────────┘   └─────┬─────┘   └──────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
   ┌───────────┐                   ┌──────────────┐
   │  WORKER   │                   │DELIVERY_STAFF│
   └───────────┘                   └──────────────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │   CUSTOMER   │
                                   └──────────────┘
```

## 3. Centralized Authorization Architecture

- **`RolePermissionEvaluator`**: Custom Spring Security `PermissionEvaluator` checking whether a given user holds the required granular authority (e.g., `hasAuthority('COW_WRITE')`).
- **No Scattered Manual Role Checks**: Endpoints are secured declaratively:
  ```java
  @PreAuthorize("hasAuthority('COW_WRITE')")
  @PostMapping
  public ResponseEntity<ApiResponse<CowResponse>> createCow(...) { ... }
  ```
- **Password Protection**: Passwords hashed with BCrypt (strength 12) before persisting. Plaintext passwords never stored or logged.
