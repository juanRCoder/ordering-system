# Tareas: Gestión de Órdenes

**Feature Directory**: `specs/001-gestion-ordenes`
**Basado en**: `plan.md`
**Estado**: Las tareas reflejan el desarrollo ya completado; la columna
_Verificación_ confirma si cada una coincide con el código actual.

> Plantilla `tasks-template.md` no encontrada en el repo; se usa la estructura
> estándar (Tareas / Dependencias / Verificación).

## Leyenda de verificación

- ✅ Coincide — el código implementa lo descrito.
- ⚠️ Parcial — no aplica (ninguna tarea quedó parcial en esta feature).
- ❌ No coincide — no encontrado en el código.

---

## Backend

### [x] T-BE-01 · Módulo de órdenes

- **Acción**: Crear `orders.module.ts` declarando `OrdersController` +
  `OrdersService` e importando `AuthModule`.
- **Resultado**: Módulo registrado y resoluble por NestJS.
- **Depende de**: ninguna.
- **Verificación**: ✅ `orders.module.ts` importa `AuthModule`, declara
  controller y provider.

### [x] T-BE-02 · Controller y rutas REST + SSE

- **Acción**: Implementar `orders.controller.ts` con `GET /`, `GET /:id`,
  `POST /:slug`, `PATCH /:id`, `PATCH /:id/confirm`, `DELETE /:id`,
  `SSE stream/:slug`. Aplicar `AdminGuard` salvo `POST` y `SSE`.
- **Resultado**: Todas las rutas responden con los contratos de `plan.md` §2.
- **Depende de**: T-BE-01, T-BE-03, T-BE-04/05/06.
- **Verificación**: ✅ `orders.controller.ts` expone las 7 rutas; `POST` y
  `SSE` sin `AdminGuard`, resto con `AdminGuard` (`controller.ts:28,39,45,62,72,82,53`).

### [x] T-BE-03 · DTOs de validación

- **Acción**: Crear `dto/create-order.dto.ts` (`CreateOrderDto` +
  `SupplyItemDto`), `dto/update-order.dto.ts`, `dto/confirm-order.dto.ts`.
- **Resultado**: Payloads validados con `class-validator`.
- **Depende de**: ninguna.
- **Verificación**: ✅ Los 3 DTOs existen con decoradores de validación.

### [x] T-BE-04 · Servicio: creación y adición de suministros (US-3)

- **Acción**: Implementar `OrdersService.create` con lógica de `order_id`
  (incrementa `total`, suma cantidades de `supplies_orders` existentes) y
  `validateSupplies`.
- **Resultado**: `POST /:slug` crea o extiende una orden; total recalculado.
- **Depende de**: T-BE-03.
- **Verificación**: ✅ `create` (`orders.service.ts:21`) ramifica en `order_id`
  (`:43`) e incrementa total; `validateSupplies` (`:128`) lanza
  `SUPPLY_NOT_FOUND` / `SUPPLY_NOT_AVAILABLE` / `SUPPLY_PRICE_MISMATCH`.

### [x] T-BE-05 · Servicio: listado y filtros (US-1)

- **Acción**: Implementar `findAll` con paginación (`limit=10`), filtro por
  `status`, filtro de fecha (`getDateRange`) aplicado solo a `FINISHED`, y
  conteo de pendientes.
- **Resultado**: `GET /` devuelve `{ data, counts.pending, metadata.pagination }`.
- **Depende de**: ninguna.
- **Verificación**: ✅ `findAll` (`orders.service.ts:216`) aplica
  `getDateRange(dateFilter)` solo si `status === 'FINISHED'` (`:230`).

### [x] T-BE-06 · Servicio: actualización de estado/pago/tipo (US-2)

- **Acción**: Implementar `update` para `status`, `payment_type`, `order_type`.
- **Resultado**: `PATCH /:id` persiste los campos y responde `{ ok: true }`.
- **Depende de**: T-BE-03.
- **Verificación**: ✅ `update` (`orders.service.ts:297`).

### [x] T-BE-07 · Servicio: confirmación (US-4)

- **Acción**: Implementar `confirm` que persiste `is_confirmed`.
- **Resultado**: `PATCH /:id/confirm` acepta `{ is_confirmed: boolean }`.
- **Depende de**: T-BE-03.
- **Verificación**: ✅ `confirm` (`orders.service.ts:328`).

### [x] T-BE-08 · Servicio: detalle y stream SSE

- **Acción**: Implementar `findById` (con `supplies_orders` anidados) y
  `getOrdersStream` vía `SseBroadcaster`.
- **Resultado**: `GET /:id` y `SSE stream/:slug` funcionan.
- **Depende de**: T-BE-01.
- **Verificación**: ✅ `findById` (`:174`), `getOrdersStream` (`:124`) usando
  `SseBroadcaster`.

### [x] T-BE-09 · Servicio: eliminación (US-5)

- **Acción**: Implementar `delete` que borra `supplies_orders` y la orden.
- **Resultado**: `DELETE /:id` elimina la orden (actualmente permitido a ADMIN).
- **Depende de**: T-BE-01.
- **Verificación**: ✅ `delete` (`orders.service.ts:357`) **SÍ implementado**;
  borra la orden y sus `supplies_orders`. Coincide con el comportamiento
  documentado en la spec (eliminación permitida).

### [x] T-BE-10 · Tests unitarios del servicio

- **Acción**: Crear `__test__/orders.service.spec.ts`.
- **Resultado**: Cobertura de casos del servicio.
- **Depende de**: T-BE-04..09.
- **Verificación**: ✅ Archivo presente en `__test__/`.

---

## Frontend

### [x] T-FE-01 · Tipos e interfaz (US-1..4)

- **Acción**: Crear `interfaces/orders.interface.ts` con `CreateOrderPayload`,
  `OrderListResponseType`, `OrderDetailResponseType`, `updateOrder`.
- **Resultado**: Tipos usados por service/hooks/UI.
- **Depende de**: ninguna.
- **Verificación**: ✅ `interfaces/orders.interface.ts` define los 4 tipos.

### [x] T-FE-02 · Esquema de validación (US-3)

- **Acción**: Crear `schemas/orders.schema.ts` (`newOrderSchema`,
  `supplyOrderSchema`) con refine de `guest_name` cuando no hay `order_id`.
- **Resultado**: Validación Zod del payload de creación.
- **Depende de**: T-FE-01.
- **Verificación**: ✅ `orders.schema.ts` con refine (`:16`).

### [x] T-FE-03 · Service de órdenes

- **Acción**: Crear `services/orders.service.ts` con `create`, `getAll`,
  `getById`, `update`, `delete`, `confirm` sobre `suppliesService.apiFetch()`.
- **Resultado**: Wrapper fetch autenticado alineado a `plan.md` §2.
- **Depende de**: T-FE-01/02, backend T-BE-02.
- **Verificación**: ✅ `orders.service.ts` tiene los 6 métodos
  (`create:10`, `getAll:30`, `getById:37`, `update:42`, `delete:60`,
  `confirm:67`).

### [x] T-FE-04 · Hooks React Query (US-1..5)

- **Acción**: Crear `hooks/useOrders.ts` con `useCreateOrder`, `useOrdersQuery`,
  `useOrderByIdQuery`, `useUpdateOrder`, `useDeleteOrder`, `useOrdersStream`,
  `useConfirmOrder` (invalidan `OrdersKeys`, toasts).
- **Resultado**: Hooks consumibles por la UI admin/cliente.
- **Depende de**: T-FE-03, `OrdersKeys` (`lib/querykeys.ts:46`),
  `useSSEStream` (`hooks/useSSEStream.ts:7`).
- **Verificación**: ✅ `useOrders.ts` exporta los 7 hooks; `OrdersKeys` y
  `useSSEStream` existen.

---

## Resumen de verificación

| User Story                          | Tareas                 | Coincide con código         |
| ----------------------------------- | ---------------------- | --------------------------- |
| US-1 Visualización por estado/fecha | T-BE-05, T-FE-01/04    | ✅                          |
| US-2 Cambio estado/pago/tipo        | T-BE-06, T-FE-01/03/04 | ✅                          |
| US-3 Agregar suministros            | T-BE-04, T-FE-02/03/04 | ✅                          |
| US-4 Confirmar orden                | T-BE-07, T-FE-01/03/04 | ✅                          |
| US-5 Eliminación de órdenes         | T-BE-09                | ✅ Implementado y permitido |

**Total de tareas**: 14 (10 backend + 4 frontend).
**Bloqueadas por gap de plan**: 0.
**Incidencia**: T-BE-09 implementa `DELETE` y coincide con el código. La
eliminación es un comportamiento permitido y documentado (spec actualizada), no
un gap. No requiere decisión de diseño nueva.
