# Ordering System - Agent Guide

## Quick Commands

```bash
# Install deps (root)
pnpm install

# Backend
pnpm --filter backend lint
pnpm --filter backend build
pnpm --filter backend test
pnpm --filter backend test:e2e
pnpm --filter backend start:dev
pnpm --filter backend docker:up        # Start local PostgreSQL 16 via Docker
pnpm --filter backend db:seed          # Seed the database

# Frontend
pnpm --filter frontend lint
pnpm --filter frontend build
pnpm --filter frontend dev

# Formatting (root)
pnpm format:check
pnpm format:fix
```

## Architecture

- **Monorepo**: pnpm workspaces with `backend/` and `frontend/` (a `packages/` folder exists but only holds `FUTURE.md`)
- **Backend**: NestJS (v11) + Prisma (v7) + PostgreSQL. API prefix: `/api`. Port 3003 (configurable via `PORT`). CORS with `credentials: true`, default origin `http://localhost:5173`. Global rate limiting (100 req/min) via `@nestjs/throttler`. CSRF protection via `CsrfGuard` (validates `Origin`/`Referer` against `CORS_ORIGINS` on state-changing requests).
- **Frontend**: React 19 + Vite 8 + Tailwind CSS v4 + shadcn/ui-style components on `@base-ui/react` (base-vega look) + react-router v7. Path alias `@/` → `src/`.

## Backend Structure

`backend/src/features/` contains domain modules: `auth/`, `categories/`, `orders/`, `supplies/`. Each feature is a NestJS module. Other top-level folders: `cloudinary/` (image uploads), `common/` (`decorators/`, `filters/`, `guards/`, `interceptors/`), `config/` (`app.config.ts`), `utils/` (`date-range.util.ts`).

Prisma v7 uses the new `prisma-client` generator (output `src/generated/prisma`, excluded from tsconfig/prettier) with the **driver adapter** `@prisma/adapter-pg` (`PrismaService` builds `PrismaPg` from `DATABASE_URL` at runtime). The schema datasource has no `url` — it is read from env. **Must run `prisma generate` before building** after schema changes.

Models: `Users`, `Sessions`, `Subscriptions` (schema-only, no feature module yet), `Categories`, `Supplies`, `AdminSupplies`, `Orders`, `SuppliesOrders`.

Enums: `Roles` (USER, ADMIN, SUPER_ADMIN), `StatusSupply` (AVAILABLE, UNAVAILABLE), `StatusOrder` (PENDING, FINISHED), `PaymentType` (CASH, YAPE), `OrderType` (LOCAL, TAKEAWAY), `SupplyOrigin` (PLATFORM, ADMIN), `PlanType` (FREE_TRIAL, MONTHLY, SEMI_ANNUAL, ANNUAL), `SubscriptionStatus` (ACTIVE, EXPIRED).

Auth uses JWT access token + refresh token in httpOnly cookies (sessions persisted in `Sessions`). Two guards: `AdminGuard` (validates `auth-token` cookie, requires ADMIN or SUPER_ADMIN role) and `RefreshTokenGuard` (validates `refresh-token` cookie against Sessions table). Global guards: `ThrottlerGuard` (rate limiting) and `CsrfGuard` (origin validation on state-changing requests). Registration always assigns role ADMIN. Supplies images are uploaded to Cloudinary (env `CLOUDINARY_URL`) via Multer v2 (memory storage, 5MB limit, jpg/jpeg/png/webp only). Cookie options include explicit `path: '/api'`.

SSE endpoints (all public, without AdminGuard):

| Endpoint                                | Purpose                     |
| --------------------------------------- | --------------------------- |
| `GET /api/auth/stream/:slug`            | Business open/closed status |
| `GET /api/supplies/stream/:slug/status` | Supply availability changes |
| `GET /api/supplies/stream/:slug/price`  | Price update notifications  |
| `GET /api/orders/stream/:slug`          | New order notifications     |

DB: target principal es **Supabase** (session pooler). Fallback local: PostgreSQL 16 via Docker (`pnpm --filter backend docker:up`). La conexión activa la define `DATABASE_URL` en `backend/.env` (Supabase activa, local comentada como fallback). Aplicar migraciones sobre Supabase con `prisma migrate deploy`; `migrate dev` queda para el Postgres local. Seed: `pnpm --filter backend db:seed`.

Config uses `@nestjs/config` with the `app.config.ts` pattern (reads `PORT`, `NODE_ENV`, `CORS_ORIGINS`).

## Frontend Structure

Routes live in `src/router.tsx` (react-router v7): `/` and `/auth` (Auth), plus `/:slug` with `menu`, `cart`, `order-received/:orderId`, `orders`, `supplies` and `settings`. Admin pages (`Orders`, `Supplies`) are under `/:slug/orders` and `/:slug/supplies` — all routes share the slug prefix. Admin components live in `src/pages/admin/`, customer pages at `src/pages/`.

Supporting folders:

- `stores/` (zustand): `business.store.ts` (persisted: business name, slug, owner, phone, open status), `cart.store.ts` (items, total, add/remove/increment/decrement/clear)
- `services/`: `auth`, `categories`, `orders`, `supplies` — `supplies.service.ts` exports `apiFetch()`, an authenticated fetch wrapper with auto 401 token refresh; `orders.service.ts` reuses it
- `schemas/` (Zod v4 — import as `import z from 'zod'`, API uses `z.email()`)
- `interfaces/`: `auth`, `categories`, `errors`, `orders`, `supplies`
- `hooks/`: `useAuth`, `useCategories`, `useOrders`, `useSupplies`
- `lib/`: `default.ts` (form defaults), `querykeys.ts` (React Query key factories), `time.ts` (relativeTime, dayTime), `toast.ts` (toast style configs), `token.ts` (JWT decode), `utils.ts` (cn utility)
- `skeletons/`: `CategorySkeleton`, `OrderCardSkeleton`, `OrderDetailSkeleton`, `SupplyCardSkeleton`
- `components/`: subcarpetas `admin/`, `auth/`, `cart/`, `menu/`, `ui/` (17 Base UI components: button, card, collapsible, dialog, drawer, field, input, label, pagination, radio-group, scroll-area, select, separator, sonner, switch, toggle-group, toggle)

Data fetching: @tanstack/react-query. Forms: react-hook-form + zod. UI: `@base-ui/react`-based shadcn/ui components, `vaul` (drawers), `sonner` (toasts), `next-themes` (theming). ESLint v10.

### Hooks

All hooks use `@tanstack/react-query`. Mutations invalidate query keys and show toasts via `sonner`. SSE streams create `EventSource` instances and close them on cleanup.

| Hook                         | File               | Type     | Notes                                                                       |
| ---------------------------- | ------------------ | -------- | --------------------------------------------------------------------------- |
| `useLogin`                   | `useAuth.ts`       | mutation | Invalidates `UsersKeys.me`, sets business store, navigates to `/:slug/menu` |
| `useRegister`                | `useAuth.ts`       | mutation | Invalidates `UsersKeys.me`                                                  |
| `useLogout`                  | `useAuth.ts`       | mutation | Invalidates `UsersKeys.me`, clears business store, navigates to `/auth`     |
| `useUpdateBusinessStatus`    | `useAuth.ts`       | mutation | Invalidates `SuppliesKeys.all`                                              |
| `useBusinessStatusStream`    | `useAuth.ts`       | SSE      | `/auth/stream/:slug` → invalidates supplies by slug                         |
| `useCreateCategory`          | `useCategories.ts` | mutation | Invalidates `TypesSuppliesKeys.all`                                         |
| `useCategories`              | `useCategories.ts` | query    | staleTime 5min, refetchOnWindowFocus: false                                 |
| `useTypeSupplyById`          | `useCategories.ts` | query    | enabled: `!!id`                                                             |
| `useUpdateCategory`          | `useCategories.ts` | mutation | Invalidates `TypesSuppliesKeys.all`                                         |
| `useCreateOrder`             | `useOrders.ts`     | mutation | Invalidates `OrdersKeys.all`, clears cart if `order_id` exists              |
| `useOrdersQuery`             | `useOrders.ts`     | query    | Paginated with `status` and `dateFilter` params                             |
| `useOrderByIdQuery`          | `useOrders.ts`     | query    | enabled: `!!id`                                                             |
| `useUpdateOrder`             | `useOrders.ts`     | mutation | Invalidates `OrdersKeys.all`                                                |
| `useDeleteOrder`             | `useOrders.ts`     | mutation | Invalidates `OrdersKeys.all`                                                |
| `useOrdersStream`            | `useOrders.ts`     | SSE      | `/orders/stream/:slug` → invalidates `OrdersKeys.all`                       |
| `useConfirmOrder`            | `useOrders.ts`     | mutation | Invalidates `OrdersKeys.all`                                                |
| `useCreateSupply`            | `useSupplies.ts`   | mutation | Invalidates `SuppliesKeys.all`                                              |
| `useSuppliesBySlug`          | `useSupplies.ts`   | query    | Public, paginated with `categoryId`/`letters` filters                       |
| `useSuppliesByAdmin`         | `useSupplies.ts`   | query    | Paginated with `categoryId`/`letters` filters                               |
| `useSupplyById`              | `useSupplies.ts`   | query    | enabled: `!!id`                                                             |
| `useUpdateSupplyStatus`      | `useSupplies.ts`   | mutation | Invalidates `SuppliesKeys.all`                                              |
| `useSuppliesStream`          | `useSupplies.ts`   | SSE      | `/supplies/stream/:slug/status` → invalidates `SuppliesKeys.all`            |
| `useUpdateSupply`            | `useSupplies.ts`   | mutation | Invalidates `SuppliesKeys.all`                                              |
| `useUpdateSupplyPriceStream` | `useSupplies.ts`   | SSE      | `/supplies/stream/:slug/price` → invalidates `SuppliesKeys.all`             |

## CI/CD (GitHub Actions)

CI (`.github/workflows/ci-workflow.yml`) and CD (`.github/workflows/cd-workflow.yml`) run on push/PR to `main` with **path filtering** via `dorny/paths-filter@v3`.

**CI** — quality checks per workspace:

- Backend job (only on `backend/**` changes): install → `prisma generate` (with dummy `DATABASE_URL`) → lint → `format:check` → build
- Frontend job (only on `frontend/**` changes): install → lint → `format:check` → build
- Tooling: pnpm v10, Node 20

**CD** — auto-deploy on push to `main`:

- Backend → Render (triggered via `RENDER_DEPLOY_HOOK_NODE` secret)
- Frontend → Netlify (triggered via `NETLIFY_BUILD_HOOK` secret)

## Conventions

- **Commit messages**: Conventional Commits enforced by commitlint + husky
- **Pre-commit hook**: lint-staged runs ESLint fix + Prettier on `*.{ts,js,tsx,jsx}`
- **Formatting**: Prettier with single quotes, semicolons, 2-space indent, trailing commas (es5), printWidth 80
- **Backend lint**: `@typescript-eslint/no-unused-vars` is error, `no-explicit-any` is warn
- **Frontend lint**: TypeScript ESLint recommended, browser globals

## Gotchas

- `backend/src/generated/` is auto-generated by Prisma — do not edit manually, excluded from prettier/tsconfig
- `frontend/.env` has `VITE_API_DEV=` pointing to the production URL (`https://ordering-system-ow96.onrender.com/api`). Local dev URLs are commented out. Backend `.env` needs `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`, `NODE_ENV` and `CLOUDINARY_URL`
- Prisma v7 uses the `prisma-client` generator + `@prisma/adapter-pg` driver adapter; the schema has no datasource `url`
- Backend e2e tests live in `backend/test/` with separate jest config (`jest-e2e.json`)
- The `pnpm-lock.yaml` is present — use `pnpm install`, not npm
- `supplies/` feature now has unit tests in `__test__/supplies.service.spec.ts`
- `backend/.env.example` includes `DATABASE_PASSWORD` and `DATABASE_DATABASE` (used by docker-compose.yml)
- `suppliesService.apiFetch()` is the authenticated fetch wrapper with auto 401 token refresh — `orders.service.ts` reuses it
- `@nestjs/passport` was removed (auth is purely JWT + cookies via `@nestjs/jwt`)
- Prisma CLI (`^7.9.1`) is slightly newer than `@prisma/client` and `@prisma/adapter-pg` (`^7.8.0`)
- PrismaService is globally shared via `PrismaModule` (with `@Global()` decorator) — no need to import PrismaService in feature modules
- Registration always assigns role `ADMIN` — no USER or SUPER_ADMIN registration via API
