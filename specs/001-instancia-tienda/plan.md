# Implementation Plan: 001-instancia-tienda

- **Date**: 2026-09-05
- **Status**: [Completed]

> Este plan documenta la arquitectura y los contratos de la feature
> "Instancia de Tienda" tal como está implementada en el código actual:
> creación de la instancia (registro), inicio de sesión, visualización del
> perfil y cierre de sesión.

## 1. Arquitectura

### Backend (NestJS)

- **Módulo**: `AuthModule` (`features/auth/`) — autenticación con JWT en
  cookies httpOnly (sin `@nestjs/passport`; solo `@nestjs/jwt`).
  - `POST /api/auth/register` (público, `@Throttle` 5/min) valida
    `RegisterDto` (nombre opcional, email, password `MinLength(6)`, `slug`
    min 4/max 20 solo minúsculas-números-guiones, `business_name`,
    `phone`), verifica unicidad de email y `slug` (en carrera concurrente
    el perdedor recibe 409 genérico), hashea con bcrypt y crea el usuario
    con rol `ADMIN`.
  - `POST /api/auth/login` (público, `@Throttle` 10/min) valida `LoginDto`,
    compara con bcrypt y, si es válido, firma access token (15m) y crea
    refresh token persistido en `Sessions` (7 días). Responde con los datos
    del negocio y setea las cookies `auth-token` y `refresh-token`
    (httpOnly, `secure` en producción, `path: '/api'`).
  - `POST /api/auth/logout` (`RefreshTokenGuard`) borra la `Sessions` por
    `refresh_token` y limpia ambas cookies. Cumple "invalidar en servidor +
    limpiar cliente" (US3).
  - `POST /api/auth/refresh` (`RefreshTokenGuard`, soporte) renueva el
    access token con la sesión vigente; el cliente lo usa ante un 401 sin
    pedir credenciales.
  - `AdminGuard` valida la cookie `auth-token` y exige rol `ADMIN` o
    `SUPER_ADMIN`; protege las rutas administrativas. `RefreshTokenGuard`
    valida la cookie `refresh-token` contra `Sessions` y purga expiradas.
- **DTOs** (`dto/`): `RegisterDto`, `LoginDto` — validación con
  `class-validator`.
- **Dependencias clave**: `JwtService`, `PrismaService` (global, tablas
  `Users`/`Sessions`), `cookieOptions` (`auth.constants.ts`),
  `ThrottlerGuard` global.

### Frontend (React + React Query)

- **Páginas / componentes**:
  - `pages/Auth.tsx` — alterna `LoginForm` y `RegisterForm` (US1/US2).
  - `components/auth/RegisterForm.tsx` — formulario de creación de
    instancia (US1).
  - `components/auth/LoginForm.tsx` — formulario email/password (US2).
  - `pages/Settings.tsx` — bloque `infoRows` con propietario, negocio y
    teléfono desde `business.store`, más botón de logout (US3).
- **Capa de datos**:
  - `services/auth.service.ts` — `register`, `login`, `logout` (fetch con
    `credentials: 'include'`; `login` retorna `result.data`).
  - `hooks/useAuth.ts` — `useLogin` (guarda el negocio con `setBusiness` y
    navega a `/:slug/menu`, con respaldo `caveflow` si el `slug` es nulo) y
    `useLogout` (limpia con `clearBusiness` y navega a `/auth`).
  - `stores/business.store.ts` — `setBusiness` (tras login, persistido) y
    `clearBusiness` (tras logout); migración que sanea slugs nulos
    heredados.
- **Rutas** (`router.tsx`): `/auth` pública; `/:slug/menu`, `cart` y
  `order-received` públicas; `orders`, `supplies` y `settings` bajo
  `ProtectedRoute` (redirige a `/auth` sin negocio en store).

## 2. Contratos de API (usados)

| Método | Endpoint             | Auth              | Propósito                                             |
| ------ | -------------------- | ----------------- | ----------------------------------------------------- |
| `POST` | `/api/auth/register` | Público           | Crear instancia (cuenta ADMIN + `slug`) — US1         |
| `POST` | `/api/auth/login`    | Público           | Autenticar y emitir cookies + datos del negocio — US2 |
| `POST` | `/api/auth/logout`   | RefreshTokenGuard | Invalidar sesión y limpiar cookies — US3              |
| `POST` | `/api/auth/refresh`  | RefreshTokenGuard | Renovar access token (soporte de sesión)              |

> El detalle de cuerpos y respuestas JSON pertenece a
> `docs/API_CONTRACTS.md`. El registro responde `{ sub, name }`; el login
> responde `{ name, role, business_name, slug, is_business_open, phone, ... }`
> y setea cookies; el logout responde `{ ok: true }` y limpia cookies.

## 3. Archivos nuevos / modificados y su propósito

### Backend

- `auth.module.ts` — declaración del módulo y sus dependencias.
- `auth.controller.ts` — `register`, `login`, `refresh`, `logout`
  (+ `is-business-open` y `stream/:slug`, que pertenecen a spec 004).
- `auth.service.ts` — `register` (unicidad + bcrypt + alta ADMIN),
  `login` (bcrypt + firma + sesión), `logout` (borrado de sesión),
  `refresh` (rotación).
- `auth.guard.ts` — `AdminGuard` (cookie `auth-token`, roles).
- `refreshToken.guard.ts` — `RefreshTokenGuard` (cookie + `Sessions`).
- `auth.constants.ts` — `cookieOptions` y TTLs (15m / 7d).
- `dto/register.dto.ts` — `RegisterDto`.
- `dto/login.dto.ts` — `LoginDto` (email + password `MinLength(6)`).
- `__test__/auth.service.spec.ts` — tests unitarios del servicio.

### Frontend

- `pages/Auth.tsx` — página de acceso/registro.
- `components/auth/RegisterForm.tsx` — formulario US1.
- `components/auth/LoginForm.tsx` — formulario US2.
- `components/auth/ProtectedRoute.tsx` — guard de `orders`, `supplies` y
  `settings`.
- `hooks/useAuth.ts` — `useLogin`, `useLogout` (solo avisa con toast si
  falla la red, para reintentar) (+ estado/SSE del negocio, que pertenecen
  a spec 004).
- `services/auth.service.ts` — `register`, `login`, `logout`.
- `stores/business.store.ts` — `setBusiness`, `clearBusiness`, migración
  de slug.
- `pages/Settings.tsx` — bloque de perfil (US3) y botón logout.
- `router.tsx` — ruta `/auth`.

## 4. Módulos / archivos fuera de alcance

- **Apertura/cierre del negocio** (`PATCH is-business-open`, SSE
  `stream/:slug`) — responsabilidad de spec 004; aquí solo se crea la
  cuenta y se accede.
- **Pedidos, insumos, categorías** (`orders/`, `supplies/`,
  `categories/`, `cloudinary/`) — consumen la sesión pero no forman parte
  de esta feature.
- **Recuperación de contraseña / reset por email**, **MFA**, **OAuth** —
  no contemplados.
- **Edición de perfil / cambio de contraseña** — otra iteración.
- **`Subscriptions`** — no relacionado.
