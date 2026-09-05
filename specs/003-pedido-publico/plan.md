# Implementation Plan: 003-pedido-publico

- **Date**: 2026-08-26
- **Status**: [Completed]

> Este plan describe la arquitectura y los contratos para la feature "Pedido Público"
> (spec status: _Draft_). Cubre las 5 user stories: visualización de insumos públicos
> categorizados y carrito (US1), configuración de tipo de pedido (US2), selección de mesa
> disponible (US3), registro de nombre y monto total (US4) y resumen final antes de
> confirmar (US5). Todo el flujo se resuelve en el **frontend** y en el contrato de
> creación de órdenes ya existente;
> La selección de mesa (US3) es puramente una experiencia de usuario que, al
> elegir la mesa N, rellena `guest_name` con el texto `"Mesa N"`.

## 1. Arquitectura

### Backend (NestJS)

- **Módulo `OrdersModule`** (existente) — el endpoint `POST /api/orders/:slug` ya es
  **público** y crea la orden (PENDING) con `guest_name`, `total`, `order_type`
  (LOCAL/TAKEAWAY) y la lista de `supplies` (`SupplyItemDto`). El backend no conoce el concepto
  de mesa: para pedidos LOCAL, el frontend envía `guest_name = "Mesa N"`.
- **SSE existente** `GET /api/orders/stream/:slug` (público) ya notifica al admin las
  nuevas órdenes; se reutiliza sin cambios.

### Frontend (React + React Query)

- **Estado**: `cart.store.ts` (existente) ya maneja `items`, `addItem`, `increment`,
  `decrement`, `remove`, `clear` y `totalPrice`/`totalSupplies`. Se añade el contexto de
  pedido (`order_type` LOCAL/TAKEAWAY y `guest_name`) en el store del carrito o en un
  `order.store.ts` nuevo.
- **Regla de negocio de mesa (US3)**: cuando el cliente elige consumo en local (LOCAL) y
  selecciona la mesa N, el sistema establece `guest_name = "Mesa N"` (y solo eso, sin
  otro texto).
- **Regla de nombre (US4)**: para pedidos PARA LLEVAR (TAKEAWAY), el cliente ingresa su
  nombre manualmente en `guest_name`. Para LOCAL, `guest_name` ya viene fijado como
  `"Mesa N"` por la selección de mesa y no se edita.
- **Capa de datos**:
  - `services/orders.service.ts` (existente) — `create` ya envía `guest_name`, `total`,
    `order_type` y `supplies`. No requiere cambios de contrato; solo el frontend decide el
    valor de `guest_name` según mesa/tipo.
  - `hooks/useSupplies.ts` (existente) — `useSuppliesBySlug` ya trae insumos públicos
    paginados por categoría (US1).
- **Páginas** (existentes, a extender):
  - `pages/Menu.tsx` — categorías + insumos + agregar al carrito (US1).
  - `pages/Cart.tsx` — selector de `order_type` (US2), grilla de mesas (solo si LOCAL) que
    al elegir la mesa N fija `guest_name = "Mesa N"` (US3), input de `guest_name` (solo si
    TAKEAWAY) (US4), desglose de `totalPrice` (US4) y sección de resumen (US5).

## 2. Contratos de API (usados / modificados)

| Método | Endpoint                   | Auth    | Propósito                                                                                 |
| ------ | -------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `GET`  | `/api/supplies/:slug`      | Público | Listar insumos públicos AVAILABLE paginados por categoría (US1)                           |
| `POST` | `/api/orders/:slug`        | Público | Crear orden PENDING con `guest_name`, `total`, `order_type`, `supplies` (US2/US3/US4/US5) |
| `SSE`  | `/api/orders/stream/:slug` | Público | Notificar nuevas órdenes al admin                                                         |

> El detalle de cuerpos, parámetros y respuestas JSON pertenece a `docs/API_CONTRACTS.md`.
> La creación de órdenes usa `CreateOrderDto` con `guest_name`, `total`, `order_type` y
> `supplies` (`SupplyItemDto`). Para LOCAL el frontend envía
> `guest_name = "Mesa N"`; para TAKEAWAY envía el nombre ingresado por el cliente.

## 3. Archivos nuevos / modificados y su propósito

### Backend

- Ninguno. El contrato `POST /api/orders/:slug` ya cubre la creación de la orden con los
  campos necesarios; la "mesa" se transporta dentro de `guest_name`.

### Frontend

- `stores/order.store.ts` (nuevo o extensión de `cart.store.ts`) — `order_type`
  (LOCAL/TAKEAWAY) y `guest_name`.
- `pages/Cart.tsx` — selector de tipo de pedido (US2); grilla de mesas para LOCAL que fija
  `guest_name = "Mesa N"` al seleccionar (US3); input de nombre para TAKEAWAY (US4);
  desglose de `totalPrice` (US4); sección de resumen final (US5).
- `pages/Menu.tsx` — agrupación por categoría y agregado al carrito (US1, existente,
  verificar filtrado AVAILABLE).
- `services/orders.service.ts` — sin cambios de contrato; el payload ya incluye
  `guest_name`, `total`, `order_type` y `supplies`.

## 4. Módulos / archivos fuera de alcance

- **Autenticación / roles admin** (`auth/`, `AdminGuard`) — el flujo público no requiere
  login; la creación de órdenes ya es pública.
- **Gestión admin de insumos/categorías** (`supplies/`, `categories/`) — se consumen pero
  no se modifican en esta feature.
- **Flag administrativo** (`is_confirmed`, `PATCH /api/orders/:id/confirm`) —
  existe en el backend sin UI; aquí solo se crea la orden PENDING.
- **Pagos reales (YAPE/CASH)** — solo se registra el tipo en la orden; la cobranza queda
  fuera de alcance.
- **Suscripciones / facturación** (`Subscriptions`) — no relacionado.
- **Edición de una orden ya creada por el cliente** — fuera de alcance (el cliente puede
  editar antes de confirmar en el carrito, no después).
