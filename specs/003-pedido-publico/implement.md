# Implementation Log: Pedido Público

**Branch**: `003-pedido-publico` | **Plan**: `specs/003-pedido-publico/plan.md` | **Tasks**: `specs/003-pedido-publico/tasks.md`

**Date**: 2026-08-26 · **Status**: [Completed]

> La feature ya estaba implementada en el repo (spec status: _Draft_). Esta fase **verifica**
> que cada tarea de `tasks.md` coincide con el código y ejecuta lint + build del frontend.
> No se escribió código nuevo: todas las tareas ya estaban presentes en el repo y alineadas
> al plan. La "mesa" no es una entidad del backend; elegir la mesa N fija
> `guest_name = "Mesa N"`.

## Registro de ejecución

| Tarea   | Acción ejecutada                 | Archivos tocados                                  | Verificación                                                                               |
| ------- | -------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| T-BE-01 | Verificado contrato de creación  | `orders.controller.ts`, `dto/create-order.dto.ts` | ✅ `POST /:slug` público; `guest_name`, `total`, `order_type`, `supplies`. Sin `table_id`. |
| T-FE-01 | Verificado contexto de pedido    | `business.store.ts`, `Cart.tsx`                   | ✅ `guest_name`/`order_id` en `business.store`; `isTakeaway` local en `Cart.tsx`.          |
| T-FE-02 | Verificado menú categorizado     | `pages/Menu.tsx`, `SupplyCard.tsx`                | ✅ Categorías + filtro `AVAILABLE`; `addItem` del carrito.                                 |
| T-FE-03 | Verificado selector de tipo      | `Cart.tsx`, `GuestSelector.tsx`                   | ✅ Alterna mesa / "Para llevar"; `order_type` LOCAL por defecto.                           |
| T-FE-04 | Verificada grilla de mesas (US3) | `GuestSelector.tsx`                               | ✅ `selectTable(n)` → `onChange("Mesa N")`; sin `table_id`.                                |
| T-FE-05 | Verificado nombre y total (US4)  | `Cart.tsx`, `GuestSelector.tsx`                   | ✅ Input nombre en llevar; `totalPrice` mostrado; submit bloqueado sin nombre.             |
| T-FE-06 | Verificado resumen final (US5)   | `Cart.tsx`, `useOrders.ts`, `orders.service.ts`   | ✅ Lista insumos/cantidades/total; confirma y crea PENDING.                                |
| T-FE-07 | Verificado payload de creación   | `services/orders.service.ts`                      | ✅ `create` envía `guest_name`, `total`, `order_type`, `supplies`.                         |

## Verificación de build

- Comando: `pnpm --filter frontend lint` → sin errores.
- Comando: `pnpm --filter frontend build` → `✓ built in 31.01s` (tsc + vite).
- Resultado: frontend compila y pasa lint. No se requirieron cambios de código.

## Leaks Detected

Ninguno. El plan cubre todo el comportamiento y no hubo decisiones de diseño faltantes:

- La "mesa" se resolvió en el frontend como `guest_name = "Mesa N"` (acordado en la
  corrección del plan), sin `table_id` ni módulo de mesas.
- El estado de `order_type`/`guest_name` usa `business.store` + estado local en `Cart.tsx`
  en lugar de `cart.store`/`order.store` como sugería el plan, pero es equivalente
  funcionalmente y no introduce un gap.

## Notas

- El flujo público reutiliza `POST /api/orders/:slug` (público) y `GET /api/supplies/:slug`
  (público); el admin recibe la nueva orden vía `GET /api/orders/stream/:slug`.
- No se tocaron módulos de auth, categories, supplies ni el modelo de datos (Prisma).
