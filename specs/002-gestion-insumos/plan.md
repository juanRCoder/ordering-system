# Implementation Plan: 002-gestion-insumos

- **Date**: 2026-08-25
- **Status**: [Completed]

> Este plan documenta la arquitectura y los contratos de la feature "Gestión de
> Insumos" tal como está implementada en el código actual (spec status: _Completado_).
> Cubre las 3 user stories de la spec: creación de insumo propio, edición (propio en
> totalidad / plataforma solo nombre y precio) y habilitación/deshabilitación con
> reflejo en tiempo real.

## 1. Arquitectura

### Backend (NestJS)

- **Módulo**: `SuppliesModule` (`supplies.module.ts`) — provee `SuppliesService` y
  `SuppliesController`. Reutiliza `AdminGuard` y `CurrentAdmin` de `AuthModule`.
- **Servicio**: `SuppliesService` (`supplies.service.ts`) — lógica sobre Prisma. Mantiene
  dos `SseBroadcaster`: `status$` (disponibilidad) y `price$` (precio/nombre) para notificar
  vía SSE. Sube imágenes a Cloudinary (`CloudinaryService`). Usa `$transaction` para crear
  `supplies` + `adminSupplies` de forma consistente.
- **Controller**: `SuppliesController` (`supplies.controller.ts`) — endpoints REST bajo
  `/api/supplies`. Creación, edición y cambio de estado usan `AdminGuard`; los streams SSE
  son públicos.
- **DTOs** (`dto/`): `CreateSupplyDto`, `UpdateSupplyDto`, `EventSupplyDto`,
  `EventUpdatePriceDto` — validación con `class-validator`.
- **Dependencias clave**: `PrismaService` (global), `CloudinaryService`, `SseBroadcaster`
  (`common/sse-broadcaster`), enums generados (`StatusSupply`, `SupplyOrigin`).

### Frontend (React + React Query)

- **Capa de datos** desacoplada por carpeta (`suppl*.ts`):
  - `services/supplies.service.ts` — wrapper `fetch` que reutiliza `apiFetch` con
    refresh automático de token 401.
  - `interfaces/supplies.interface.ts` — tipos de payload, lista y detalle.
  - `schemas/supplies.schema.ts` — validación Zod (`createSupplySchema`, `updateSupplySchema`).
  - `hooks/useSupplies.ts` — hooks React Query (query + mutations + SSE) que invalidan
    `SuppliesKeys` y muestran toasts.
- **UI admin**: `pages/admin/Supplies.tsx`, `components/admin/SupplyDialog.tsx`
  (creación/edición; oculta categoría/imagen en insumos de plataforma y no envía
  `category_id` en su edición), `components/admin/SupplyCard.tsx` (toggle de estado).
- **Streaming**: `useSuppliesStream` y `useUpdateSupplyPriceStream` consumen
  `GET /api/supplies/stream/:slug/status` y `/price` vía `useSSEStream`.

## 2. Contratos de API (usados / modificados)

| Método  | Endpoint                            | Auth       | Propósito                                 |
| ------- | ----------------------------------- | ---------- | ----------------------------------------- |
| `POST`  | `/api/supplies`                     | AdminGuard | Crear insumo propio (`origin = ADMIN`)    |
| `GET`   | `/api/supplies/:id`                 | AdminGuard | Detalle del insumo (nombre, precio, cat.) |
| `GET`   | `/api/supplies`                     | AdminGuard | Listar insumos del admin (paginado)       |
| `PATCH` | `/api/supplies/:id`                 | AdminGuard | Editar insumo (restricción por `origin`)  |
| `PATCH` | `/api/supplies/:id/status`          | AdminGuard | Habilitar/deshabilitar (toggle)           |
| `SSE`   | `/api/supplies/stream/:slug/status` | Público    | Notificar cambio de disponibilidad        |
| `SSE`   | `/api/supplies/stream/:slug/price`  | Público    | Notificar cambio de precio/nombre         |

## 3. Archivos nuevos / modificados y su propósito

### Backend

- `supplies.module.ts` — declaración del módulo y sus dependencias.
- `supplies.controller.ts` — definición de rutas REST + SSE.
- `supplies.service.ts` — `create`, `findBySlug`, `findByAdminId`, `findById`, `update`
  (con restricción por `origin` y persistencia de `category_id`), `updateStatus`
  (toggle + SSE), `getAdminSupplyUpdateStream`, `getAdminSupplyUpdatePriceStream`.
- `dto/create-supply.dto.ts` — `CreateSupplyDto` (name, price, category_id, ...).
- `dto/update-supply.dto.ts` — `UpdateSupplyDto` (name, price, category_id, imagen).
- `dto/event-supply.dto.ts` — `EventSupplyDto`, `EventUpdatePriceDto`.
- `__test__/supplies.service.spec.ts` — tests unitarios del servicio.

### Frontend

- `services/supplies.service.ts` — `create`, `findByAdminId`, `getBySlug`, `getById`,
  `updateStatus`, `update` sobre `apiFetch`.
- `interfaces/supplies.interface.ts` — `CreateSupplyType`, `UpdateSupplyType`,
  `SupplyResponse`, `OriginType`.
- `schemas/supplies.schema.ts` — `createSupplySchema`, `updateSupplySchema`.
- `hooks/useSupplies.ts` — `useCreateSupply`, `useSuppliesBySlug`, `useSuppliesByAdmin`,
  `useSupplyById`, `useUpdateSupplyStatus`, `useSuppliesStream`, `useUpdateSupply`,
  `useUpdateSupplyPriceStream`.
- `pages/admin/Supplies.tsx` — lista admin con toggle y diálogo.
- `components/admin/SupplyDialog.tsx` — formulario crear/editar (oculta categoría/imagen
  en plataforma; no envía `category_id` en edición de plataforma).
- `components/admin/SupplyCard.tsx` — tarjeta con switch de estado.
- `pages/Menu.tsx`, `components/menu/SupplyCard.tsx` — menú cliente consume streams y
  filtra por `status === 'AVAILABLE'`.

## 4. Módulos / archivos fuera de alcance

- **Eliminación de insumos** — no contemplada en la spec.
- **Suscripciones/planes** (`Subscriptions`) — aún sin módulo.
- **Roles USER / SUPER_ADMIN** para gestión de insumos — fuera de alcance.
- **UI de páginas** salvo las indicadas — consumen hooks pero no forman el contrato de datos.
- **Módulos de otras features**: `auth/`, `categories/`, `orders/`, `cloudinary/`.
