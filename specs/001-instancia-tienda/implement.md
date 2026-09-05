# Implementation Log: Instancia de Tienda

**Branch**: `001-instancia-tienda` | **Plan**: `specs/001-instancia-tienda/plan.md` | **Tasks**: `specs/001-instancia-tienda/tasks.md`

**Date**: 2026-09-05 · **Status**: [Completed]

> Esta spec se **reescribió** el 2026-09-05: antes documentaba gestión de
> órdenes (contenido movido fuera de esta spec) y ahora dirige la creación
> de la instancia, el login y el perfil/logout. Absorbe la antigua spec
> `005-autenticacion` (carpeta eliminada; su contenido vive aquí como
> US2/US3). La feature ya estaba implementada; esta fase **verifica** que
> cada tarea coincide con el código. No se escribió código nuevo.

## Registro de ejecución

| Tarea   | Acción ejecutada              | Archivos tocados                                                           | Verificación                                                                                         |
| ------- | ----------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| T-BE-01 | Confirmado registro (US1)     | `auth.controller.ts`, `auth.service.ts`, `dto/register.dto.ts`             | ✅ `POST register` público con throttle 5/min; unicidad email/slug (409); hash bcrypt; alta ADMIN    |
| T-BE-02 | Confirmado login (US2)        | `auth.controller.ts`, `auth.service.ts`, `dto/login.dto.ts`                | ✅ `POST login` con throttle 10/min; bcrypt + firma + `Sessions`; cookies httpOnly `path:'/api'`     |
| T-BE-03 | Confirmado logout (US3)       | `auth.controller.ts`, `auth.service.ts`                                    | ✅ `POST logout` con `RefreshTokenGuard`; borra `Sessions` y limpia cookies; responde `{ ok: true }` |
| T-BE-04 | Confirmados guards/cookies    | `auth.guard.ts`, `refreshToken.guard.ts`, `auth.constants.ts`              | ✅ `AdminGuard` (roles) y `RefreshTokenGuard` (`Sessions`); `cookieOptions` + endpoint `refresh`     |
| T-BE-05 | Confirmados tests unitarios   | `__test__/auth.service.spec.ts`                                            | ✅ archivo presente (registro, login, refresh, apertura)                                             |
| T-FE-01 | Confirmada UI acceso/registro | `pages/Auth.tsx`, `components/auth/*`                                      | ✅ `Auth` alterna `LoginForm`/`RegisterForm`; ruta `/auth`                                           |
| T-FE-02 | Confirmado login + store      | `hooks/useAuth.ts`, `services/auth.service.ts`, `stores/business.store.ts` | ✅ `useLogin` guarda negocio y navega a `/:slug/menu` (respaldo `caveflow`); persist + migración     |
| T-FE-03 | Confirmado bloque de perfil   | `pages/Settings.tsx`                                                       | ✅ `infoRows` propietario/negocio/teléfono con `N/A`                                                 |
| T-FE-04 | Confirmado logout + limpieza  | `hooks/useAuth.ts`, `services/auth.service.ts`, `pages/Settings.tsx`       | ✅ `useLogout` limpia store y navega a `/auth` (en error solo toast); botón Cerrar Sesión            |
| T-FE-05 | Confirmado guard admin        | `components/auth/ProtectedRoute.tsx`, `router.tsx`                         | ✅ `orders`/`supplies`/`settings` bajo guard; públicas fuera                                         |

## Verificación de tests

- Comando: `pnpm --filter backend lint` → sin errores.
- Comando: `pnpm --filter frontend lint` → sin errores.
- Batería: `__test__/auth.service.spec.ts` presente (registro, login,
  refresh, apertura).

## Leaks Detected

Ninguno. El plan cubre todo el comportamiento y no hubo decisiones de
diseño faltantes:

- El registro es público por diseño (cada quien crea su instancia); no hay
  gestión de usuarios ni invitaciones, documentado en supuestos.
- El respaldo de slug `caveflow` para cuentas antiguas sin `slug` vive en
  `useLogin` + migración del store, documentado en casos borde.
- El endpoint `refresh` es soporte de sesión (no user story) y queda
  documentado como tal.
