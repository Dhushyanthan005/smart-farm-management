# DairyFlow - Frontend Architecture

## 1. Technology Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with custom design tokens
- **Component Primitives**: Radix UI / shadcn/ui headless pattern
- **Server State**: TanStack Query (React Query)
- **Form Management**: React Hook Form
- **Schema Validation**: Zod
- **Data Visualization**: Recharts
- **Icons**: Lucide React

## 2. Directory Architecture & Separation of Concerns

```
frontend/
├── app/                  # Routing only: layouts, loading states, page boundaries
│   ├── (auth)/           # Authentication route group (Login, Forgot Password, Reset)
│   └── (dashboard)/      # Authenticated dashboard route group (Herd, Milk, Health, etc.)
│
├── features/             # Domain-specific components, hooks, and business logic
│   ├── cows/             # Cow registration form, lineage graph, ear-tag search
│   ├── milk/             # Morning/evening collection inputs, yield charts
│   ├── health/           # Medical logs, vet visit scheduler
│   └── ...               # (16 domain feature directories)
│
├── components/           # Reusable generic UI components
│   ├── ui/               # Base design system primitives (Button, Input, Card, Modal)
│   ├── layout/           # Dashboard shell, Topbar, Sidebar, User menu
│   ├── navigation/       # Navigation items, mobile drawers
│   ├── forms/            # Form fields, search inputs, date pickers
│   ├── tables/           # Data table wrappers, sorting headers, pagination
│   └── charts/           # Standardized chart wrappers
│
├── lib/                  # Shared infrastructure and client-side logic
│   ├── api/              # Domain-specific REST API client modules
│   ├── auth/             # Token storage, auth cookies, token refresh
│   ├── validation/       # Shared Zod validation schemas
│   ├── utils/            # CSS class merger (cn), formatting, date helpers
│   └── permissions/      # Role-based UI guards (CanAccess, hasRole)
│
├── types/                # Strongly-typed TypeScript interfaces and DTOs
└── providers/            # React context providers (QueryClient, AuthContext, Theme)
```

## 3. Design System & Aesthetics

DairyFlow implements an agricultural design system:

| Token | Hex / HSL | Usage |
|---|---|---|
| **Primary (Forest Green)** | `#1E3A2F` / `hsl(158, 32%, 18%)` | Primary buttons, brand headers, active nav items |
| **Secondary (Olive)** | `#4D6A42` / `hsl(104, 23%, 34%)` | Secondary highlights, badges, trend accents |
| **Background (Warm Neutral)** | `#F8F9F6` | Page background, subtle neutral contrast |
| **Surface (Card White)** | `#FFFFFF` | Cards, modals, data tables |
| **Foreground (Charcoal)** | `#1F2421` | High-contrast readable typography |
| **Muted Borders** | `#E2E5DF` | Card dividers, input borders |
| **Restrained Shadows** | `0 1px 3px 0 rgba(0, 0, 0, 0.05)` | Clean, non-distracting elevation |

## 4. State Management & API Consumption Rules

1. **No direct fetch calls in UI**: Components consume centralized API clients (`lib/api/*`) via TanStack Query custom hooks.
2. **Predictable Query Invalidation**: Mutations in `features/*` explicitly invalidate relevant query keys.
3. **Form Validation at the Boundary**: Forms execute client-side validation using Zod resolvers before dispatching HTTP payloads.
