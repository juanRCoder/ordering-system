# Specification: 001-gestion-de-ordenes

- **Date**: 2026-08-24
- **Status**: [Completed]

## Resumen

Permite al admin gestionar los pedidos del negocio: visualizarlos separados por estado y
fecha, cambiar su estado y forma de pago, agregar suministros a una orden existente,
y marcarlas como confirmadas. Esta especificación **refleja el comportamiento actual del
código**.

| #   | User Story                            | Prioridad | Estado en código                                   |
| --- | ------------------------------------- | --------- | -------------------------------------------------- |
| 1   | Visualizar órdenes por estado y fecha | P1        | ✅ Implementado                                    |
| 2   | Cambiar estado y forma de pago        | P1        | ✅ Implementado                                    |
| 3   | Agregar suministros a orden existente | P3        | ✅ Implementado (vía `POST /:slug` con `order_id`) |
| 4   | Confirmar orden (`is_confirmed`)      | P2        | ✅ Implementado                                    |
| 5   | Eliminación de órdenes                | P2        | ✅ Implementado                                    |

## User Scenarios _(mandatory)_

### User Story 1 - Visualización de órdenes por estado y fecha (Priority: P1)

El admin accede al panel de órdenes y consulta las órdenes pendientes y las finalizadas.
Dentro de las finalizadas puede filtrar por fecha: hoy, ayer y fechas anteriores.

**Scenarios**:

1. admin autenticado accede a órdenes → el sistema muestra las PENDING por defecto.
2. admin selecciona "finalizadas" → el sistema muestra solo las FINISHED.
3. en finalizadas, aplica filtro "hoy" → solo FINISHED de la fecha actual.
4. en finalizadas, aplica filtro "ayer" → solo FINISHED del día anterior.
5. en finalizadas, aplica filtro "anteriores" → solo FINISHED previas a ayer.

---

### User Story 2 - Cambio de estado y forma de pago (Priority: P1)

El admin cambia el estado (PENDING ↔ FINISHED) y el tipo de pago (CASH / YAPE) de una orden.

**Scenarios**:

1. orden PENDING, admin la marca finalizada → estado pasa a FINISHED.
2. admin cambia método de pago → se persiste CASH o YAPE.
3. actualización exitosa → el sistema notifica y refresca la orden.

> Nota: el endpoint `PATCH /api/orders/:id` también acepta `order_type` (LOCAL/TAKEAWAY).

---

### User Story 3 - Agregar suministros a una orden existente (Priority: P3)

El admin añade suministros a una orden ya creada; el total se recalcula.

**Scenarios**:

1. admin agrega un suministro a una orden → se incluye en el detalle.
2. orden con suministros previos, admin agrega más → el total se recalcula.
3. cambios persistidos → la vista se actualiza.

> Implementación actual: se reutiliza `POST /api/orders/:slug` enviando `order_id`;
> el servicio incrementa el total y suma/multiplica cantidades de los suministros.

---

### User Story 4 - Confirmar orden (`is_confirmed`) (Priority: P2)

El admin marca una orden como confirmada (o desmarca) para reflejar validación manual del pedido.

**Scenarios**:

1. admin abre una orden → el sistema muestra su estado de confirmación (`is_confirmed`).
2. admin marca la orden como confirmada → `is_confirmed` pasa a `true`.
3. admin desmarca la orden → `is_confirmed` pasa a `false`.
4. cambio de confirmación exitoso → el sistema persiste y refresca la orden.

> Endpoint: `PATCH /api/orders/:id/confirm` con `{ is_confirmed: boolean }`.
> No confundir con el estado PENDING/FINISHED: la confirmación es un flag independiente.

---

### User Story 5 - Eliminación de órdenes (Priority: P2)

> ✅ **Implementado.** El admin puede eliminar órdenes; el backend expone
> `DELETE /api/orders/:id` protegido por `AdminGuard` (`orders.controller.ts:83`,
> `orders.service.ts:357`) y borra la orden junto con sus `supplies_orders` en una
> transacción. En la UI, la acción de eliminar **solo** está disponible para órdenes
> `TAKEAWAY` que están `PENDING` y no confirmadas (`OrderCard.tsx`, botón `Trash2`
> dentro de `showTakeawayActions`).

El admin elimina órdenes (integridad de historial delegada a la restricción de UI por tipo/estado).

- El **UI** (`OrderCard.tsx`) expone la acción de eliminación para órdenes `TAKEAWAY`
  pendientes y no confirmadas. ✅
- El **API** expone `DELETE /api/orders/:id` protegido por `AdminGuard`
  (`orders.controller.ts:83`, `orders.service.ts:357`). ✅ Borra la orden y sus
  `supplies_orders`.

**Acceptance Scenarios (estado actual)**:

1. admin visualiza una orden `TAKEAWAY` pendiente no confirmada → el sistema muestra
   acción para eliminarla. (cumplido en UI)
2. admin elimina la orden vía UI → el sistema la borra y elimina sus `supplies_orders`.
   (cumplido en API)

## Casos Borde

- Orden finalizada sin suministros → se muestra igual en su filtro.
- Filtro de fecha sin resultados → estado vacío claro, sin error.
- Cambio a FINISHED de una orden ya FINISHED → idempotente, no altera otros datos.
- Agregar suministro inexistente o no disponible → el sistema valida y rechaza
  (`SUPPLY_NOT_FOUND` / `SUPPLY_NOT_AVAILABLE` / `SUPPLY_PRICE_MISMATCH`).
- Confirmar una orden ya confirmada / no confirmada → idempotente.
- Eliminación vía UI disponible solo para órdenes `TAKEAWAY` pendientes y no confirmadas; vía API permitida para cualquier orden (bajo `AdminGuard`).
- Roles distintos (p. ej. SUPER_ADMIN) → fuera de alcance de esta especificación.

## Requisitos _(mandatory)_

### Requisitos funcionales

- El sistema DEBE permitir al admin visualizar órdenes separadas por estado (PENDING/FINISHED).
- El sistema DEBE permitir filtrar FINISHED por fecha: hoy, ayer, anteriores.
- El sistema DEBE permitir modificar el estado (PENDING/FINISHED) de una orden.
- El sistema DEBE permitir modificar el tipo de pago (CASH/YAPE) de una orden.
- El sistema DEBE permitir modificar el tipo de orden (LOCAL/TAKEAWAY) de una orden.
- El sistema DEBE permitir agregar suministros a una orden existente y recalcular el total.
- El sistema DEBE permitir marcar/desmarcar una orden como confirmada (`is_confirmed`).
- El sistema DEBE requerir autenticación y rol ADMIN para estas operaciones.

### Requisitos de seguridad

- El sistema PERMITE al admin eliminar órdenes: en la UI solo para órdenes `TAKEAWAY`
  pendientes y no confirmadas (`OrderCard.tsx`), y vía API (`DELETE /api/orders/:id`,
  `AdminGuard`) para cualquier orden. Comportamiento intencional y documentado.

### Entidades clave

- **Orden**: id, estado (PENDING/FINISHED), tipo de pago (CASH/YAPE), tipo de orden
  (LOCAL/TAKEAWAY), `is_confirmed` (boolean), fecha de creación, suministros asociados, total.
- **Suministro (en orden)**: nombre, cantidad, precio. Relacionado vía `supplies_orders`.

## Criterios de éxito _(mandatory)_

### Resultados medibles

- Admin localiza una FINISHED de hoy/ayer/anteriores en menos de 3 interacciones.
- 100% de cambios de estado, pago y confirmación se reflejan de inmediato tras la acción.
- Al agregar suministros, el total recalculado es consistente con la suma en el 100% de los casos.
- 100% de eliminaciones de órdenes `TAKEAWAY` pendientes no confirmadas vía UI se completan correctamente.

## Supuestos

- El admin accede autenticado con rol ADMIN.
- "Hoy/ayer/anteriores" se calculan en la zona horaria del servidor sobre `created_at`.
- La adición de suministros usa el catálogo existente (`adminSupplies`).
- La eliminación está permitida para ADMIN (UI: `TAKEAWAY` pendiente no confirmada; API: general bajo `AdminGuard`).
- El sistema ya cuenta con autenticación, roles y la estructura órdenes/suministros.
