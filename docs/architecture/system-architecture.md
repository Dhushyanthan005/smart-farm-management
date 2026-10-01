# DairyFlow - High-Level System Architecture

## 1. Executive Summary

**DairyFlow** is a modern, production-grade Smart Dairy Farm Management System designed to unify farm operations, herd health management, milk collection, logistics, financial accounting, and customer subscriptions into a cohesive platform.

The system is architected as a **Modular Monolith** to maximize developer productivity, operational simplicity, and domain boundary enforcement, while allowing individual bounded contexts to transition cleanly into microservices in future scaling phases.

## 2. Architecture Overview

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
        ^                            ^                            ^
        |                            |                            |
  Herd Data, Milk Logs,        Fast Metrics,                Cow Photos,
  Financials, Orders           Token Denylists,             Invoices,
  and RBAC Records             Rate Limiting                Health Records
```

### Future Extensibility
```
+--------------------+        +---------------------+        +--------------------+
|  IoT Sensors/RFID  | -----> |   MQTT Broker       | -----> | DairyFlow Core API |
+--------------------+        +---------------------+        +---------+----------+
                                                                       |
+--------------------+                                                 |
|  AI/ML Forecasts   | <-----------------------------------------------+
|  (FastAPI / Py)    | (Yield prediction, mastitis detection, heat cycle forecasting)
+--------------------+
```

## 3. Core Architectural Tenets

### 3.1 Modular Monolith
- **Zero premature microservices**: Distributed systems overhead (distributed tracing, network latency, distributed transactions) is avoided in the current phase.
- **Bounded Contexts**: 19 distinct functional modules (`cows`, `milk`, `health`, etc.) reside within isolated packages under `com.dairyflow.modules`.
- **Package Encapsulation**: Cross-module communication is conducted via exposed Service Interfaces or domain events, preventing direct repository or entity leakage.

### 3.2 SOLID Principles
- **Single Responsibility (S)**: Controllers handle HTTP translation, Services coordinate business logic, Repositories handle persistence, Mappers handle DTO-entity conversions.
- **Open/Closed (O)**: Core abstractions (e.g., `NotificationService`, `FileStorageService`) are designed for extension without modifying caller code.
- **Liskov Substitution (L)**: Implementations like `InAppNotificationService` and `LocalFileStorageService` can be swapped for cloud-native providers seamlessly.
- **Interface Segregation (I)**: Focused, purpose-built interfaces rather than bloated general-purpose contracts.
- **Dependency Inversion (D)**: High-level business policies do not depend on low-level database primitives; services depend on repository and client interfaces.
