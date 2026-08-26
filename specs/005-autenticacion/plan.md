# Implementation Plan: 005-autenticacion

- **Date**: 2026-08-26
- **Status**: [Completed]

> Este plan describe la arquitectura y los contratos para la feature "Autenticación"
> (spec `005-autenticacion`, status: _Draft_). Cubre las 2 user stories: iniciar sesión con
> email y contraseña (US1) y cerrar sesión de forma segura (US2).
>
> **Estado actual del código**: ambas user stories ya están implementadas de extremo a
> extremo en el backend (NestJS + JWT en cookies httpOnly) y en el frontend (formulario de
> login, hooks y store). Por tanto, este plan **no introduce cambios**: documenta la
> arquitectura existente y sirve como verificación. No se crean endpoints, DTOs ni archivos
> nuevos.

## 1. Arquitectura

### Backend (NestJS)

- **Módulo `AuthModule`** (`features/auth/`) — autenticación basada en JWT en cookies
  httpOnly (sin `@nestjs/passport`; solo `@nestjs/jwt`).
  - `POST /api/auth/login` (público, con `@Throttle` 10/60s) valida `LoginDto` (email +
    password `MinLength(6)`), compara con bcrypt y, si es válido, firma un access token
    (15m) y crea un refresh token persistido en `Sessions` (7 días). Responde con los datos
    del negocio y **setea las cookies** `auth-token` y `refresh-token` (httpOnly, secure en
    producción, `path: '/api'`, sameSite `none`/`lax`).
  - `POST /api/auth/logout` (RefreshTokenGuard) llama a `authService.logout`, que **elimina
    la sesión** de `Sessions` por `refresh_token` y devuelve ok; el controller limpia ambas
    cookies. Esto cumple "invalidar en servidor + limpiar cliente" (US2).
  - `POST /api/auth/refresh` (RefreshTokenGuard) renueva el access token usando la sesión
    vigente (soporte de sesión continua, ver casos borde de la spec).
  - `AdminGuard` valida la cookie `auth-token` y exige rol `ADMIN`/`SUPER_ADMIN`; protege
    las rutas administrativas. `RefreshTokenGuard` valida la cookie `refresh-token` contra
    `Sessions` y borra sesiones expiradas.
- **Dependencias clave**: `JwtService`, `PrismaService` (global, tabla `Sessions`),
  `cookieOptions` (`auth.constants.ts`), `class-validator` en DTOs, `ThrottlerGuard`
  global (rate limiting).

### Frontend (React + React Query)

- **Páginas / componentes**:
  - `pages/Auth.tsx` — alterna entre `LoginForm` y `RegisterForm` (registro fuera de
    alcance de US1/US2, pero existe y crea la cuenta que luego inicia sesión).
  - `components/auth/LoginForm.tsx` — formulario email/password que invoca `useLogin`.
  - `hooks/useAuth.ts` — `useLogin` (llama `authService.login`, guarda el negocio en
    `business.store` y navega a `/:slug/menu`) y `useLogout` (llama `authService.logout`,
    limpia el store y navega a `/auth`).
  - `services/auth.service.ts` — `login` y `logout` (fetch con `credentials: 'include'`).
  - `stores/business.store.ts` — `setBusiness` (tras login) y `clearBusiness` (tras logout).
- **Renovación de token**: el cliente reintenta con `refresh` ante un 401 (vía
  `suppliesService.apiFetch`/wrapper); no requiere re-login manual.

## 2. Contratos de API (usados / modificados)

| Método | Endpoint            | Auth              | Propósito                                                           |
| ------ | ------------------- | ----------------- | ------------------------------------------------------------------- |
| `POST` | `/api/auth/login`   | Público           | Autenticar admin con email + password y emitir cookies (US1)        |
| `POST` | `/api/auth/logout`  | RefreshTokenGuard | Cerrar sesión: invalidar sesión en servidor y limpiar cookies (US2) |
| `POST` | `/api/auth/refresh` | RefreshTokenGuard | Renovar el access token (continuidad de sesión)                     |

> El detalle de cuerpos, parámetros y respuestas JSON pertenece a `docs/API_CONTRACTS.md`.
> `POST /api/auth/login` recibe `{ email, password }` (validado por `LoginDto`) y responde
> con los datos del negocio; las cookies viajan en la respuesta. `POST /api/auth/logout`
> borra la `Sessions` asociada al refresh token y limpia `auth-token`/`refresh-token`.

## 3. Archivos nuevos / modificados y su propósito

### Backend

- **Ninguno**. Los endpoints, guards, DTO y servicio ya existen y cubren US1/US2. Archivos
  ya presentes (sin cambios):
  - `auth.controller.ts` — `login`, `logout`, `refresh`, `register`.
  - `auth.service.ts` — `login` (bcrypt + firma + creación de sesión), `logout` (borrado de
    sesión), `refresh`.
  - `auth.guard.ts` — `AdminGuard` (cookie `auth-token`, rol ADMIN/SUPER_ADMIN).
  - `refreshToken.guard.ts` — `RefreshTokenGuard` (cookie `refresh-token` + `Sessions`).
  - `auth.constants.ts` — `cookieOptions` (httpOnly, secure en prod, `path: '/api'`).
  - `dto/login.dto.ts` — `LoginDto` (`@IsEmail`, password `@MinLength(6)`).

### Frontend

- **Ninguno**. Archivos ya presentes (sin cambios):
  - `pages/Auth.tsx` — página de login/registro.
  - `components/auth/LoginForm.tsx` — formulario de credenciales (US1).
  - `hooks/useAuth.ts` — `useLogin`, `useLogout`.
  - `services/auth.service.ts` — `login`, `logout`.
  - `stores/business.store.ts` — `setBusiness`, `clearBusiness`.

## 4. Módulos / archivos fuera de alcance

- **Registro de admins desde la UI pública** (`RegisterForm`/`register`): existe para crear
  la cuenta, pero alta de usuarios no es parte de US1/US2 (la spec lo declara fuera de
  alcance).
- **Recuperación de contraseña / reset por email**, **MFA** y **OAuth (Google, etc.)** —
  no contemplados.
- **Roles USER / SUPER_ADMIN en el flujo de login**: `AdminGuard` los admite, pero el
  registro asigna `ADMIN`; no es parte de estas user stories.
- **Edición de perfil / cambio de contraseña** — otra iteración.
- **Módulos de otras features**: `supplies/`, `categories/`, `orders/`, `cloudinary/`.
