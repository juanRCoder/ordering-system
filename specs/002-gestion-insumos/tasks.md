# Tasks: 002-gestion-insumos

- **Plan**: `specs/002-gestion-insumos/plan.md`
- **Date**: 2026-08-25
- **Status**: [Completed]

Las tareas reflejan el desarrollo ya completado; la columna _Verificación_ confirma si cada una coincide con el código actual.

> Plantilla `tasks-template.md` no encontrada en el repo; se usa la estructura
> estándar (Tareas / Dependencias / Verificación).

## Leyenda de verificación

- ✅ Coincide — el código implementa lo descrito.
- ⚠️ Parcial — implementado parcialmente.
- ❌ No coincide — no encontrado en el código.

---

## Backend

### [x] T-BE-01 · Módulo de insumos

- **Acción**: Crear `supplies.module.ts` declarando `SuppliesController` +
  `SuppliesService`.
- **Resultado**: Módulo registrado y resoluble por NestJS.
- **Depende de**: ninguna.
- **Verificación**: ✅ `supplies.module.ts` declara controller y provider.

### [x] T-BE-02 · Controller y rutas REST + SSE

- **Acción**: Implementar `supplies.controller.ts` con `POST`, `GET /`, `GET /:id`,
  `PATCH /:id`, `PATCH /:id/status` y los streams SSE `stream/:slug/status` y
  `stream/:slug/price`. Aplicar `AdminGuard` salvo los SSE.
- **Resultado**: Todas las rutas responden con los contratos de `plan.md` §2.
- **Depende de**: T-BE-01, T-BE-03.
- **Verificación**: ✅ `supplies.controller.ts` expone las rutas; `POST`, `PATCH`,
  `PATCH/status` con `AdminGuard`, SSE sin guard.

### [x] T-BE-03 · DTOs de validación

- **Acción**: Crear `dto/create-supply.dto.ts` (`CreateSupplyDto`) y
  `dto/update-supply.dto.ts` (`UpdateSupplyDto`) con `class-validator`.
- **Resultado**: Payloads validados (name, price, category_id, imagen).
- **Depende de**: ninguna.
- **Verificación**: ✅ Ambos DTOs existen con decoradores de validación.

### [x] T-BE-04 · Servicio: creación de insumo propio (US-1)

- **Acción**: Implementar `SuppliesService.create` que crea `supplies` con
  `origin = ADMIN`, `creator_admin_id`, `category_id` e imagen en Cloudinary, y su fila
  `adminSupplies` con `name`/`price`.
- **Resultado**: `POST /api/supplies` crea insumo propio del admin.
- **Depende de**: T-BE-03.
- **Verificación**: ✅ `create` (`supplies.service.ts`) setea `origin: 'ADMIN'`,
  `creator_admin_id`, `category_id` y sube vía `CloudinaryService`.

### [x] T-BE-05 · Servicio: edición con restricción por origin (US-2)

- **Acción**: Implementar `SuppliesService.update` que persiste `name`/`price` en
  `adminSupplies`; para `origin = ADMIN` también `category_id` e imagen en `supplies`.
  Si `origin = PLATFORM` y llega `category_id` o `file` → `PLATFORM_SUPPLY_EDIT_FORBIDDEN`.
- **Resultado**: `PATCH /api/supplies/:id` edita propio en totalidad y plataforma solo
  nombre/precio.
- **Depende de**: T-BE-03.
- **Verificación**: ✅ `update` lee `supply.origin` vía `include`; persiste `category_id`
  para ADMIN y lanza `BadRequestException` con `PLATFORM_SUPPLY_EDIT_FORBIDDEN` para
  plataforma con `category_id`/`file`.

### [x] T-BE-06 · Servicio: habilitar/deshabilitar + SSE (US-3)

- **Acción**: Implementar `SuppliesService.updateStatus` que alterna `status` y emite
  `status$` por `SseBroadcaster`.
- **Resultado**: `PATCH /api/supplies/:id/status` toggle + notificación en tiempo real.
- **Depende de**: T-BE-01.
- **Verificación**: ✅ `updateStatus` togglea y hace `this.status$.next(admin.slug!, ...)`.

### [x] T-BE-07 · Servicio: listado y detalle

- **Acción**: Implementar `findBySlug`, `findByAdminId`, `findById` (paginados y con
  filtros por categoría/letras).
- **Resultado**: `GET` por slug, por admin y por id funcionan.
- **Depende de**: ninguna.
- **Verificación**: ✅ `findBySlug`, `findByAdminId`, `findById` presentes y paginados.

### [x] T-BE-08 · Tests unitarios del servicio

- **Acción**: Crear `__test__/supplies.service.spec.ts`.
- **Resultado**: Cobertura de casos del servicio.
- **Depende de**: T-BE-04..07.
- **Verificación**: ✅ Archivo presente en `__test__/`.

---

## Frontend

### [x] T-FE-01 · Tipos e interfaz

- **Acción**: Crear `interfaces/supplies.interface.ts` con `CreateSupplyType`,
  `UpdateSupplyType`, `SupplyResponse`, `OriginType`.
- **Resultado**: Tipos usados por service/hooks/UI.
- **Depende de**: ninguna.
- **Verificación**: ✅ `interfaces/supplies.interface.ts` define los tipos.

### [x] T-FE-02 · Esquema de validación

- **Acción**: Crear `schemas/supplies.schema.ts` (`createSupplySchema`,
  `updateSupplySchema`) con `class-validator`-style Zod.
- **Resultado**: Validación del payload de creación/edición.
- **Depende de**: T-FE-01.
- **Verificación**: ✅ `supplies.schema.ts` con ambos esquemas.

### [x] T-FE-03 · Service de insumos

- **Acción**: Crear `services/supplies.service.ts` con `create`, `findByAdminId`,
  `getBySlug`, `getById`, `updateStatus`, `update` sobre `apiFetch`.
- **Resultado**: Wrapper fetch autenticado alineado a `plan.md` §2.
- **Depende de**: T-FE-01/02, backend T-BE-02.
- **Verificación**: ✅ `supplies.service.ts` tiene los 6 métodos.

### [x] T-FE-04 · Hooks React Query (US-1..3)

- **Acción**: Crear `hooks/useSupplies.ts` con `useCreateSupply`, `useSuppliesBySlug`,
  `useSuppliesByAdmin`, `useSupplyById`, `useUpdateSupplyStatus`, `useSuppliesStream`,
  `useUpdateSupply`, `useUpdateSupplyPriceStream` (invalidan `SuppliesKeys`, toasts).
- **Resultado**: Hooks consumibles por la UI admin/cliente.
- **Depende de**: T-FE-03, `SuppliesKeys` (`lib/querykeys.ts`), `useSSEStream`.
- **Verificación**: ✅ `useSupplies.ts` exporta los hooks; SSE suscritos en `Menu.tsx`.

### [x] T-FE-05 · UI admin: diálogo y tarjeta (US-1..3)

- **Acción**: Crear `pages/admin/Supplies.tsx`, `components/admin/SupplyDialog.tsx`
  (crear/editar; oculta categoría/imagen y no envía `category_id` en plataforma) y
  `components/admin/SupplyCard.tsx` (toggle de estado).
- **Resultado**: Admin crea, edita y habilita/deshabilita insumos; el menú refleja en
  tiempo real.
- **Depende de**: T-FE-04.
- **Verificación**: ✅ `SupplyDialog` restringe plataforma (`isPlatformEdit`),
  `SupplyCard` usa `useUpdateSupplyStatus`; `Menu.tsx` filtra `status === 'AVAILABLE'`.

---

## Resumen de verificación

| User Story                                              | Tareas                       | Coincide con código |
| ------------------------------------------------------- | ---------------------------- | ------------------- |
| US-1 Crear insumo propio                                | T-BE-04, T-FE-01/03/05       | ✅                  |
| US-2 Editar (propio total / plataforma nombre y precio) | T-BE-05, T-FE-01/02/03/04/05 | ✅                  |
| US-3 Habilitar/deshabilitar con reflejo en tiempo       | T-BE-06, T-FE-04/05          | ✅                  |

**Total de tareas**: 13 (8 backend + 5 frontend).
**Bloqueadas por gap de plan**: 0.
**Incidencia**: T-BE-05 implementa la persistencia de `category_id` (antes solo validado)
y la restricción `PLATFORM_SUPPLY_EDIT_FORBIDDEN`; el diálogo admin dejó de enviar
`category_id` en edición de plataforma. Todo coincide con el comportamiento documentado.
