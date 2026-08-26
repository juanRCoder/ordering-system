# Tasks: 004-gestion-negocio

- **Plan**: `specs/004-gestion-negocio/plan.md`
- **Date**: 2026-08-26
- **Status**: [Completed]

> Plantilla `tasks-template.md` no encontrada en el repo; se usa la estructura
> estándar (Tareas / Dependencias / Verificación). El plan indica que las tres user
> stories ya están implementadas en el frontend y que **no requieren cambios en el
> backend** (US3 es estado de cliente en `business.store`, sin endpoint ni columna).
> Por tanto, estas tareas son de **verificación** del código existente.

---

## Backend

### [x] T-BE-01 · Verificar reutilización de endpoints de negocio (sin cambios)

- **Acción**: Confirmar que `PATCH /api/auth/is-business-open` y `GET /api/auth/stream/:slug`
  cubren US2, y que no existe — ni se requiere — ningún endpoint ni campo para
  `table_count` (US3 es frontend-only).
- **Resultado**: El backend no requiere modificaciones para ninguna de las 3 user stories.
- **Depende de**: ninguna.
- **Verificación**: ✅ `auth.controller.ts` expone `is-business-open` (AdminGuard) y
  `stream/:slug` (SSE); no hay referencias a `table_count` en el backend.

---

## Frontend

### [x] T-FE-01 · Verificar perfil del negocio (US1)

- **Acción**: Confirmar que `pages/Settings.tsx` muestra propietario, nombre del negocio y
  teléfono desde `business.store`, poblado en el login vía `setBusiness`.
- **Resultado**: El admin visualiza su perfil (US1) sin cambios adicionales.
- **Depende de**: ninguna.
- **Verificación**: ✅ `Settings.tsx` (`infoRows`: owner_name, business_name, phone) +
  `useAuth.ts` `useLogin` → `setBusiness({ owner_name, business_name, phone })`.

### [x] T-FE-02 · Verificar apertura/cierre del negocio (US2)

- **Acción**: Confirmar que el toggle de `Settings.tsx` llama a `useUpdateBusinessStatus`
  (PATCH existente) y que `useBusinessStatusStream` escucha el SSE de apertura.
- **Resultado**: El admin abre/cierra el negocio y el cliente público se entera (US2).
- **Depende de**: ninguna.
- **Verificación**: ✅ `Settings.tsx` `handleStatusChange` → `update.mutate(status)` +
  `useAuth.ts` `useUpdateBusinessStatus` / `useBusinessStatusStream`.

### [x] T-FE-03 · Verificar configuración de mesas en el store (US3)

- **Acción**: Confirmar que el ajustador de `Settings.tsx` escribe `table_count` en
  `business.store` (`setTableCount`) y que `GuestSelector` lo lee (`table_count ?? 10`) para
  la grilla; sin envío al backend.
- **Resultado**: El admin configura la cantidad de mesas en estado de cliente (US3) y el
  selector de mesas la consume.
- **Depende de**: ninguna.
- **Verificación**: ✅ `Settings.tsx` `adjustTables` → `setTableCount(next)`;
  `GuestSelector.tsx` `const tableCount = useBusinessStore((s) => s.table_count)` con
  `?? 10`.
