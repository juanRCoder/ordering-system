# Implementation Plan: 004-gestion-negocio

- **Date**: 2026-08-26
- **Status**: [Completed]

> Este plan describe la arquitectura y los contratos para la feature "Gestión de Negocio"
> (spec `004-gestion-negocio`, status: _Completed_). Cubre las 3 user stories: visualizar
> el perfil del negocio (US1), abrir/cerrar el negocio (US2) y configurar la cantidad de
> mesas (US3).
>
> **Estado actual del código**: las tres user stories ya están implementadas en el frontend.
> US1 y US2 reutilizan el backend existente (perfil vía store poblado en login; apertura
> vía `PATCH /api/auth/is-business-open` + SSE). US3 es **puramente de frontend**: la
> cantidad de mesas (`table_count`) se guarda solo en el store del cliente
> (`business.store`) y la consume el selector de mesas; **no requiere endpoint ni columna
> en el backend**. Por tanto, este plan no introduce cambios en el backend.

## 1. Arquitectura

### Backend (NestJS)

- **Módulo `AuthModule`** (existente) — gestiona el negocio del admin autenticado.
  - `PATCH /api/auth/is-business-open` (AdminGuard) ya abre/cierra el negocio y emite por
    `SseBroadcaster` (`storeStatusChannel`). Se reutiliza sin cambios para US2.
  - `GET /api/auth/stream/:slug` (SSE, público) ya emite `{ is_business_open }` para que
    el cliente público conozca la disponibilidad. Se reutiliza sin cambios.
  - **No se añade ningún endpoint ni campo para `table_count`**: la cantidad de mesas es
    estado exclusivo del frontend (US3).

### Frontend (React + React Query)

- **Estado**: `stores/business.store.ts` ya posee el campo `table_count` y `setTableCount`.
  El perfil del negocio (`name`, `business_name`, `phone`, `is_business_open`) se carga en
  `setBusiness` durante el login y persiste vía `zustand/persist`.
- **US1 (perfil)**: `pages/Settings.tsx` ya muestra propietario, negocio y teléfono desde
  `business.store`. Sin cambios.
- **US2 (apertura)**: `pages/Settings.tsx` ya alterna `is_business_open` vía
  `useUpdateBusinessStatus` (PATCH existente) y `useBusinessStatusStream` escucha el SSE.
  Sin cambios.
- **US3 (mesas)**: `pages/Settings.tsx` ya ajusta `table_count` en el store local;
  `components/cart/GuestSelector.tsx` ya lee `table_count` del store (`?? 10`) para
  construir la grilla. Ambos sin cambios; es estado de cliente, no se envía al backend.

## 2. Contratos de API (usados / modificados)

| Método  | Endpoint                     | Auth       | Propósito                                                        |
| ------- | ---------------------------- | ---------- | ---------------------------------------------------------------- |
| `PATCH` | `/api/auth/is-business-open` | AdminGuard | Abrir/cerrar el negocio (US2; ya existe, se reutiliza)           |
| `GET`   | `/api/auth/stream/:slug`     | Público    | Estado de apertura del negocio en vivo (ya existe, se reutiliza) |

> El detalle de cuerpos, parámetros y respuestas JSON pertenece a `docs/API_CONTRACTS.md`.
> No se agrega ningún contrato nuevo: US3 no persiste en el backend.

## 3. Archivos nuevos / modificados y su propósito

### Backend

- **Ninguno**. US1/US2 reutilizan `PATCH /api/auth/is-business-open` y
  `GET /api/auth/stream/:slug`; US3 es estado de frontend y no toca el backend.

### Frontend

- `stores/business.store.ts` — ya expone `table_count` y `setTableCount` (US3); `setBusiness`
  carga el perfil desde login (US1). Sin cambios necesarios.
- `pages/Settings.tsx` — ya muestra el perfil (US1), el toggle de apertura (US2) y el
  ajustador de mesas que escribe en el store (US3). Sin cambios necesarios.
- `components/cart/GuestSelector.tsx` — ya lee `table_count` del store para la grilla de
  mesas (US3). Sin cambios necesarios.
- `hooks/useAuth.ts` / `services/auth.service.ts` — `useUpdateBusinessStatus` y
  `updateBusinessStatus` (US2) ya existen; no se añade nada para `table_count`.

## 4. Módulos / archivos fuera de alcance

- **Persistencia de `table_count` en el backend**: la cantidad de mesas vive solo en el
  store del cliente (frontend); no se crea columna en `Users` ni endpoint para guardarla.
- **Edición de los valores del perfil** (nombre del propietario, nombre del negocio,
  teléfono): US1 solo requiere **visualizarlos**; la edición es otra iteración.
- **Módulos de otras features**: `supplies/`, `categories/`, `orders/`, `cloudinary/`.
- **Pagos (YAPE/CASH) y `Subscriptions`** — no relacionados con la gestión del negocio.
- **Confirmación administrativa de órdenes** (`is_confirmed`) — responsabilidad de spec
  001; aquí solo se controla la apertura del negocio que habilita/inhabilita el menú.
- **Horarios de apertura automáticos** — fuera de alcance; US2 es apertura/cierre manual.
- **Multi-negocio por cuenta** — cada cuenta admin = un negocio (modelo actual).
