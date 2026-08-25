# Plan de Implementación: Gestión de Órdenes

**Feature Directory**: `specs/001-gestion-ordenes`
**Backend**: `backend/src/features/orders`
**Frontend**: `frontend/src` (`services/orders.service.ts`, `interfaces/orders.interface.ts`, `schemas/orders.schema.ts`, `hooks/useOrders.ts`)

> Este plan documenta la arquitectura y los contratos de la feature "Gestión de
> Órdenes" tal como está implementada en el código actual (spec status: _Completado
> Completado_). Cubre las 5 user stories de la spec: visualización por
> estado/fecha, cambio de estado/pago, adición de suministros, confirmación e
> intención de restricción de eliminación.

## 1. Arquitectura

### Backend (NestJS)

- **Módulo**: `OrdersModule` (`orders.module.ts`) — importa `AuthModule` para
  reusar `AdminGuard` y el decorador `CurrentAdmin`. Provee `OrdersService` y
  `OrdersController`.
- **Servicio**: `OrdersService` (`orders.service.ts`) — lógica de negocio sobre
  Prisma. Mantiene un `SseBroadcaster<Orders>` (`orderChannel`) para notificar
  cambios a los clientes vía SSE. Usa transacciones (`$transaction`) para
  garantizar consistencia al crear/eliminar órdenes y sus `supplies_orders`.
- **Controller**: `OrdersController` (`orders.controller.ts`) — endpoints REST bajo
  prefijo `/api/orders`. La creación (`POST`) y el stream SSE son **públicos**
  (los clientes crean pedidos); el resto usa `AdminGuard`.
- **DTOs** (`dto/`): `CreateOrderDto` (con `SupplyItemDto`), `UpdateOrderDto`,
  `ConfirmOrderDto` — validación con `class-validator`.
- **Dependencias clave**: `PrismaService` (global), `SseBroadcaster`
  (`common/sse-broadcaster`), `getDateRange` (`utils/date-range.util`),
  `DateFilter` (tipo), enums generados de Prisma (`StatusOrder`, `PaymentType`,
  `OrderType`).

### Frontend (React + React Query)

- **Capa de datos** desacoplada por carpeta (`order.*.ts`):
  - `services/orders.service.ts` — wrapper `fetch` que reutiliza
    `suppliesService.apiFetch()` (con refresh automático de token 401).
  - `interfaces/orders.interface.ts` — tipos de payload, lista y detalle.
  - `schemas/orders.schema.ts` — validación Zod (`newOrderSchema`,
    `supplyOrderSchema`).
  - `hooks/useOrders.ts` — hooks React Query (query + mutations + SSE) que
    invalidan `OrdersKeys` y muestran toasts.
- **Estado**: `cart.store.ts` (items del pedido) y `business.store.ts`
  (`order_id`, para edición de orden existente) alimentan la creación/actualización.
- **Streaming**: `useOrdersStream` consume `GET /api/orders/stream/:slug` vía
  `useSSEStream` y refresca `OrdersKeys.all`.

## 2. Contratos de API (usados / modificados)

| Método   | Endpoint                   | Auth       | Propósito                                                      | Cuerpo / Query                    |
| -------- | -------------------------- | ---------- | -------------------------------------------------------------- | --------------------------------- |
| `GET`    | `/api/orders`              | AdminGuard | Listar órdenes paginadas por `status` y `dateFilter`           | `?page`, `?status`, `?dateFilter` |
| `GET`    | `/api/orders/:id`          | AdminGuard | Detalle de orden con suministros                               | —                                 |
| `POST`   | `/api/orders/:slug`        | Público    | Crear **o** agregar suministros a orden existente (`order_id`) | `CreateOrderDto`                  |
| `PATCH`  | `/api/orders/:id`          | AdminGuard | Cambiar `status`, `payment_type`, `order_type`                 | `UpdateOrderDto`                  |
| `PATCH`  | `/api/orders/:id/confirm`  | AdminGuard | Marcar/desmarcar `is_confirmed`                                | `{ is_confirmed: boolean }`       |
| `DELETE` | `/api/orders/:id`          | AdminGuard | **Eliminar** orden (ver US-5)                                  | —                                 |
| `SSE`    | `/api/orders/stream/:slug` | Público    | Notificar nuevas órdenes/cambios                               | —                                 |

- **Respuesta `create`**: `{ status: 201, data: { order_id } }`. Al enviar
  `order_id` se hace `update` con `total.increment` y se suman cantidades de
  suministros existentes (idempotente).
- **Respuesta `findAll`**: `{ data[], counts: { pending }, metadata: { pagination } }`.
  Filtro de fecha solo aplica a `FINISHED` vía `getDateRange(dateFilter)`.
- **Validaciones de suministros** (en `validateSupplies`): `SUPPLY_NOT_FOUND`,
  `SUPPLY_NOT_AVAILABLE`, `SUPPLY_PRICE_MISMATCH`.

## 3. Archivos nuevos / modificados y su propósito

### Backend

- `orders.module.ts` — declaración del módulo y sus dependencias.
- `orders.controller.ts` — definición de rutas REST + SSE.
- `orders.service.ts` — core de negocio: `create` (con lógica de `order_id`),
  `findAll` (paginación + filtro fecha + conteo), `findById`, `update`,
  `confirm`, `delete`, `getOrdersStream` y `validateSupplies`.
- `dto/create-order.dto.ts` — `CreateOrderDto` + `SupplyItemDto`.
- `dto/update-order.dto.ts` — `UpdateOrderDto` (status/payment_type/order_type).
- `dto/confirm-order.dto.ts` — `ConfirmOrderDto` (is_confirmed).
- `__test__/orders.service.spec.ts` — tests unitarios del servicio.

### Frontend

- `services/orders.service.ts` — métodos `create`, `getAll`, `getById`, `update`,
  `delete`, `confirm` (sobre `apiFetch`).
- `interfaces/orders.interface.ts` — `CreateOrderPayload`, `OrderListResponseType`,
  `OrderDetailResponseType`, `updateOrder`.
- `schemas/orders.schema.ts` — `supplyOrderSchema`, `newOrderSchema` (con refine
  de `guest_name` cuando no hay `order_id`).
- `hooks/useOrders.ts` — `useCreateOrder`, `useOrdersQuery`, `useOrderByIdQuery`,
  `useUpdateOrder`, `useDeleteOrder`, `useOrdersStream`, `useConfirmOrder`.

## 4. Módulos / archivos fuera de alcance

- **UI de páginas admin/cliente** (`src/pages/admin/Orders.tsx`, `OrdersDetail.tsx`,
  carrito, etc.) — consumen los hooks pero no forman parte del contrato de datos.
- **Módulos de otras features**: `auth/`, `categories/`, `supplies/`, `cloudinary/`.
- **`Sessions`, `Subscriptions`** — no relacionados a la gestión de órdenes.
- **User Story 5 — eliminación de órdenes**: el contrato `DELETE /api/orders/:id`
  existe y borra la orden + `supplies_orders` (comportamiento permitido y
  documentado). En la UI la acción de eliminar solo aparece para órdenes
  `TAKEAWAY` pendientes y no confirmadas (`OrderCard.tsx`, `showTakeawayActions`).
  No requiere decisión de diseño nueva; fuera de alcance de modificación en esta
  iteración salvo alinear la documentación con el comportamiento real.
- **SUPER_ADMIN / USER** y cualquier cambio de roles — fuera de alcance.
