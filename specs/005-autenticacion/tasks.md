# Tasks: 005-autenticacion

- **Plan**: `specs/005-autenticacion/plan.md`
- **Date**: 2026-08-26
- **Status**: [Completed]

> Plantilla `tasks-template.md` no encontrada en el repo; se usa la estructura
> estándar (Tareas / Dependencias / Verificación). El plan indica que US1 (login) y US2
> (logout) ya están implementadas de extremo a extremo en backend y frontend, sin archivos
> nuevos. Por tanto, estas tareas son de **verificación** del código existente.

---

## Backend

### [x] T-BE-01 · Verificar inicio de sesión (US1)

- **Acción**: Confirmar que `POST /api/auth/login` valida `LoginDto` (email + password
  `MinLength(6)`), compara con bcrypt, emite access/refresh tokens y setea las cookies
  `auth-token`/`refresh-token` (httpOnly, secure en prod, `path: '/api'`) con throttle.
- **Resultado**: El login con credenciales válidas autentica y entrega la sesión en cookies.
- **Depende de**: ninguna.
- **Verificación**: ✅ `auth.controller.ts` `login` + `@Throttle(10/60s)`; `auth.service.ts`
  firma JWT y crea `Sessions`; `auth.constants.ts` `cookieOptions`; `dto/login.dto.ts`.

### [x] T-BE-02 · Verificar cierre de sesión (US2)

- **Acción**: Confirmar que `POST /api/auth/logout` (RefreshTokenGuard) borra la sesión de
  `Sessions` por `refresh_token` y limpia las cookies `auth-token`/`refresh-token`.
- **Resultado**: El logout invalida la sesión en el servidor y limpia las cookies del
  cliente.
- **Depende de**: ninguna.
- **Verificación**: ✅ `auth.controller.ts` `logout` → `auth.service.logout` (deleteMany
  Sessions) + `clearCookie`; `refreshToken.guard.ts`.

### [x] T-BE-03 · Verificar guards y cookies de sesión

- **Acción**: Confirmar `AdminGuard` (cookie `auth-token`, rol ADMIN/SUPER_ADMIN) y
  `RefreshTokenGuard` (cookie `refresh-token` + `Sessions`, borra expiradas); cookies
  httpOnly/secure vía `cookieOptions`.
- **Resultado**: Las rutas admin están protegidas y la renovación de token valida la
  sesión persistida.
- **Depende de**: ninguna.
- **Verificación**: ✅ `auth.guard.ts`, `refreshToken.guard.ts`, `auth.constants.ts`.

---

## Frontend

### [x] T-FE-01 · Verificar formulario y hook de login (US1)

- **Acción**: Confirmar que `pages/Auth.tsx` + `LoginForm` invocan `useLogin`, que
  `authService.login` envía credenciales con `credentials: 'include'`, y que al éxito se
  guarda el negocio en `business.store` y se navega a `/:slug/menu`.
- **Resultado**: El admin inicia sesión desde la UI y accede al panel.
- **Depende de**: ninguna.
- **Verificación**: ✅ `pages/Auth.tsx`, `components/auth/LoginForm.tsx`, `hooks/useAuth.ts`
  `useLogin`, `services/auth.service.ts` `login`, `stores/business.store.ts` `setBusiness`.

### [x] T-FE-02 · Verificar hook y store de logout (US2)

- **Acción**: Confirmar que `useLogout` llama a `authService.logout`, limpia
  `business.store` (`clearBusiness`) y navega a `/auth`.
- **Resultado**: El admin cierra sesión y el estado local se reinicia.
- **Depende de**: ninguna.
- **Verificación**: ✅ `hooks/useAuth.ts` `useLogout`, `services/auth.service.ts`
  `logout`, `stores/business.store.ts` `clearBusiness`.
