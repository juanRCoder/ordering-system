# Tasks: 003-pedido-publico

- **Plan**: `specs/003-pedido-publico/plan.md`
- **Date**: 2026-08-26
- **Status**: [Completed]

> Plantilla `tasks-template.md` no encontrada en el repo; se usa la estructura
> estándar (Tareas / Dependencias / Verificación). El backend no requiere cambios:
> se reutiliza `POST /api/orders/:slug` (público) y `GET /api/supplies/:slug`. La
> "mesa" no es una entidad del backend: elegir la mesa N fija `guest_name = "Mesa N"`.

---

## Backend

### [x] T-BE-01 · Verificar contrato de creación de orden (sin cambios)

- **Acción**: Confirmar que `POST /api/orders/:slug` acepta `guest_name`, `total`,
  `order_type` (LOCAL/TAKEAWAY) y `supplies`, y que la creación es pública (sin
  `AdminGuard`). No se añade `table_id` ni modelo de mesas.
- **Resultado**: El contrato existente cubre US2/US3/US4/US5 sin modificaciones en el
  backend.
- **Depende de**: ninguna.
- **Verificación**: ✅ `orders.controller.ts` expone `POST /:slug` público; `CreateOrderDto`
  valida `guest_name`, `total`, `order_type` y `supplies`. Sin `table_id` (ver
  `backend/src/features/orders/dto/create-order.dto.ts`).

---

## Frontend

### [x] T-FE-01 · Store de contexto de pedido

- **Acción**: Extender `stores/cart.store.ts` (o crear `stores/order.store.ts`) con
  `order_type` (LOCAL/TAKEAWAY) y `guest_name`, preservando `items`, `totalPrice` y
  `totalSupplies`.
- **Resultado**: El estado del pedido (tipo y nombre) persiste en el store y se comparte
  entre `Menu` y `Cart`.
- **Depende de**: ninguna.
- **Verificación**: ✅ El contexto de pedido usa `business.store` (`guest_name`,
  `order_id`) + estado local `isTakeaway` en `Cart.tsx`; `guest_name` se fija a
  `"Mesa N"` desde `GuestSelector`. Equivalente funcional al store propuesto.

### [x] T-FE-02 · Menú: insumos por categoría y carrito (US1)

- **Acción**: En `pages/Menu.tsx` agrupar los insumos públicos por categoría usando
  `useSuppliesBySlug` y permitir agregar/quitar del carrito (`cart.store`). Verificar que
  solo se muestran insumos AVAILABLE.
- **Resultado**: El cliente ve insumos categorizados y los agrega al carrito; los
  UNAVAILABLE no son seleccionables.
- **Depende de**: ninguna.
- **Verificación**: ✅ `Menu.tsx` agrupa por categoría (`categories.data`) y filtra
  `s.status === 'AVAILABLE'` (`availableSupplies`); `SupplyCard` agrega vía `cart.store.addItem`.

### [x] T-FE-03 · Cart: selector de tipo de pedido (US2)

- **Acción**: En `pages/Cart.tsx` agregar selector de `order_type` (LOCAL / TAKEAWAY)
  enlazado al store. Si TAKEAWAY, ocultar la grilla de mesas; si LOCAL, habilitarla.
- **Resultado**: El cliente elige el tipo de consumo; la UI muestra/oculta la selección de
  mesa según corresponda y no permite avanzar sin tipo.
- **Depende de**: T-FE-01.
- **Verificación**: ✅ `GuestSelector` alterna mesa / "Para llevar"; `Cart.tsx` deriva
  `order_type: isTakeaway ? 'TAKEAWAY' : 'LOCAL'` (default LOCAL).

### [x] T-FE-04 · Cart: grilla de mesas para LOCAL (US3)

- **Acción**: En `pages/Cart.tsx` (solo cuando `order_type === LOCAL`) mostrar una grilla
  de mesas; al elegir la mesa N fijar `guest_name = "Mesa N"` (y solo eso). Al volver a
  TAKEAWAY, descartar la selección y liberar `guest_name`.
- **Resultado**: Para pedidos LOCAL, `guest_name` queda fijado como `"Mesa N"`; no existe
  ningún campo `table_id` aparte.
- **Depende de**: T-FE-01, T-FE-03.
- **Verificación**: ✅ `GuestSelector.selectTable(n)` hace `onChange(\`Mesa ${n}\`)`y`onTakeawayChange?.(false)`; no hay `table_id` en el payload.

### [x] T-FE-05 · Cart: nombre y monto total (US4)

- **Acción**: En `pages/Cart.tsx`, para `order_type === TAKEAWAY` mostrar input de
  `guest_name` (nombre del cliente). En ambos tipos mostrar el desglose de `totalPrice`
  (suma de precio × cantidad) en todo momento. Impedir confirmar sin `guest_name`.
- **Resultado**: Para TAKEAWAY el cliente ingresa su nombre; el total se recalcula y
  muestra al modificar el carrito.
- **Depende de**: T-FE-01, T-FE-03.
- **Verificación**: ✅ `GuestSelector` muestra `InputField` "Nombre del cliente" en modo
  llevar; `Cart.tsx` muestra `S/ {totalPrice.toFixed(2)}` y deshabilita submit si
  `!guestNameValue?.trim()`.

### [x] T-FE-06 · Cart: resumen final antes de confirmar (US5)

- **Acción**: En `pages/Cart.tsx` agregar una sección de resumen que muestre insumos,
  cantidades, `order_type`, mesa (como `guest_name = "Mesa N"` si LOCAL), nombre y total,
  con opción de volver a editar y de confirmar (`orders.service.create`).
- **Resultado**: El cliente revisa el resumen y confirma; se crea la orden PENDING
  asociada al `slug`.
- **Depende de**: T-FE-03, T-FE-04, T-FE-05, T-BE-01.
- **Verificación**: ✅ `Cart.tsx` lista `items` (insumos/cantidades), muestra `guest_name`
  y `totalPrice`, y confirma vía `useCreateOrder` → `orders.service.create` (crea PENDING,
  navega a `order-received`).

### [x] T-FE-07 · Verificar payload de creación de orden (sin cambios)

- **Acción**: Confirmar que `services/orders.service.ts` (`create`) ya envía `guest_name`,
  `total`, `order_type` y `supplies`. No requiere cambios de contrato; el valor de
  `guest_name` lo decide el frontend (mesa o nombre según tipo).
- **Resultado**: El payload de `create` coincide con `plan.md` §2; la "mesa" viaja dentro
  de `guest_name`.
- **Depende de**: T-BE-01.
- **Verificación**: ✅ `orders.service.ts:create` envía `guest_name`, `total`, `supplies`
  y `order_type` (en `Cart.tsx:50-60`); la mesa va como `guest_name = "Mesa N"`.

---

## Resumen de tareas

| User Story                               | Tareas           | Notas                              |
| ---------------------------------------- | ---------------- | ---------------------------------- |
| US1 Visualizar insumos y agregar         | T-FE-02          | `useSuppliesBySlug` existente      |
| US2 Configurar tipo de pedido            | T-FE-03          |                                    |
| US3 Seleccionar mesa (LOCAL)             | T-FE-04          | Fija `guest_name = "Mesa N"`       |
| US4 Nombre y monto total                 | T-FE-05          |                                    |
| US5 Resumen final antes de confirmar     | T-FE-06          |                                    |
| Contrato backend / service (sin cambios) | T-BE-01, T-FE-07 | Reutiliza `POST /api/orders/:slug` |

**Total de tareas**: 8 (1 backend de verificación + 7 frontend).
**Bloqueadas por gap de plan**: 0.
**Estado**: ✅ Todas las tareas coinciden con el código existente (feature ya implementada).
