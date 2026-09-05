# Tasks: 001-instancia-tienda

- **Plan**: `specs/001-instancia-tienda/plan.md`
- **Date**: 2026-09-05
- **Status**: [Completed]

Las tareas reflejan el desarrollo ya completado; la columna _Verificación_
confirma si cada una coincide con el código actual.

> Esta spec absorbe la antigua `005-autenticacion` (eliminada): sus tareas de
> login/logout viven ahora aquí como T-BE-02/03 y T-FE-02/04.

## Leyenda de verificación

- ✅ Coincide — el código implementa lo descrito.
- ⚠️ Parcial — implementado parcialmente.
- ❌ No coincide — no encontrado en el código.

---

## Backend

### [x] T-BE-01 · Registro: crear instancia de tienda (US-1)

- **Acción**: Implementar `POST /api/auth/register` con `RegisterDto`
  (nombre, email, password `MinLength(6)`, `slug`,
  `business_name`, `phone`); verificar unicidad de email (`409
EMAIL_ALREADY_IN_USE`) y de `slug` (`409 SLUG_ALREADY_IN_USE`); hashear
  con bcrypt y crear el usuario con rol `ADMIN`. Throttle 5/min.
- **Resultado**: Toda cuenta creada es ADMIN y dueña de su `slug`.
- **Depende de**: ninguna.
- **Verificación**: ✅ `auth.controller.ts:33-37` (`@Throttle 5/min`,
  `POST register`); `auth.service.ts:40-81` (unicidad `:41-61`, hash `:63`,
  alta ADMIN `:65-75`; en carrera concurrente el perdedor recibe 409
  genérico); `dto/register.dto.ts:9-37` (`slug` min 4/max 20, solo minúsculas,
  números y guiones).

### [x] T-BE-02 · Login con email y contraseña (US-2)

- **Acción**: Implementar `POST /api/auth/login` con `LoginDto` (email +
  password `MinLength(6)`); comparar con bcrypt; firmar access token (15m)
  y crear refresh token en `Sessions` (7d); responder datos del negocio y
  setear cookies `auth-token`/`refresh-token` (httpOnly, `path: '/api'`).
  Throttle 10/min.
- **Resultado**: Login válido otorga sesión en cookies + datos del negocio.
- **Depende de**: T-BE-01.
- **Verificación**: ✅ `auth.controller.ts:39-53` (`@Throttle 10/min`,
  seteo de cookies `:49-50`); `auth.service.ts:83-125` (búsqueda `:86-88`,
  bcrypt `:97`, firma+sesión `:106-110`, datos `:112-124`);
  `dto/login.dto.ts:3-11`.

### [x] T-BE-03 · Logout seguro (US-3)

- **Acción**: Implementar `POST /api/auth/logout` con `RefreshTokenGuard`;
  borrar la `Sessions` por `refresh_token` y limpiar ambas cookies.
- **Resultado**: La sesión queda invalidada en servidor y cliente.
- **Depende de**: T-BE-02.
- **Verificación**: ✅ `auth.controller.ts:71-93` (guard `:71`, borrado
  condicional `:77-79`, limpieza `:84-85`, `{ ok: true }` `:87-92`);
  `auth.service.ts:159-163` (`deleteMany` por `refresh_token`).

### [x] T-BE-04 · Guards, cookies y sesión continua

- **Acción**: Implementar `AdminGuard` (cookie `auth-token`, roles
  `ADMIN`/`SUPER_ADMIN`), `RefreshTokenGuard` (cookie `refresh-token`
  contra `Sessions` con purga de expiradas), `cookieOptions` (httpOnly,
  `secure` en prod, `path: '/api'`) y `POST /api/auth/refresh` (rotación).
- **Resultado**: Rutas admin protegidas y sesión renovable sin re-login.
- **Depende de**: T-BE-02.
- **Verificación**: ✅ `auth.guard.ts:11-46` (falta token `:18-23`, rol
  `:28-33`); `refreshToken.guard.ts`; `auth.constants.ts:8-35`;
  `auth.controller.ts:55-69` (refresh); `auth.service.ts:127-157`.

### [x] T-BE-05 · Tests unitarios del servicio

- **Acción**: Crear `__test__/auth.service.spec.ts` con casos de registro,
  login, refresh y apertura.
- **Resultado**: Cobertura de casos del servicio.
- **Depende de**: T-BE-01..04.
- **Verificación**: ✅ Archivo presente en `__test__/` (registro con hash
  y slug duplicado, login ok/inexistente/clave, refresh y rotación).

---

## Frontend

### [x] T-FE-01 · Formularios de acceso y registro (US-1/US-2)

- **Acción**: Crear `pages/Auth.tsx` que alterna `LoginForm` y
  `RegisterForm` para crear la instancia e iniciar sesión.
- **Resultado**: El usuario se registra e ingresa desde `/auth`.
- **Depende de**: ninguna.
- **Verificación**: ✅ `pages/Auth.tsx`,
  `components/auth/LoginForm.tsx`,
  `components/auth/RegisterForm.tsx`; ruta `/auth` en `router.tsx:22`.

### [x] T-FE-02 · Hook de login + store del negocio (US-2)

- **Acción**: Crear `useLogin` (llama `authService.login`, guarda el
  negocio con `setBusiness` y navega a `/:slug/menu`, con respaldo
  `caveflow` si el `slug` es nulo) y `authService.login` con
  `credentials: 'include'`.
- **Resultado**: Login válido deja negocio en store y entra al panel.
- **Depende de**: T-FE-01, backend T-BE-02.
- **Verificación**: ✅ `hooks/useAuth.ts:15-47` (`setBusiness` con
  respaldo de slug, `navigate` a `/:slug/menu`);
  `services/auth.service.ts:29-48`; `stores/business.store.ts`
  (`setBusiness`, persist + migración de slug).

### [x] T-FE-03 · Bloque de perfil del negocio (US-3)

- **Acción**: Mostrar en `pages/Settings.tsx` el propietario, el negocio y
  el teléfono desde `business.store`, con `N/A` si falta alguno.
- **Resultado**: El usuario visualiza su perfil sin fallar con datos
  incompletos.
- **Depende de**: T-FE-02.
- **Verificación**: ✅ `pages/Settings.tsx:33-49` (`infoRows`:
  Propietario/Negocio/Teléfono con `|| 'N/A'`).

### [x] T-FE-04 · Hook de logout + limpieza (US-3)

- **Acción**: Crear `useLogout` (llama `authService.logout`, limpia con
  `clearBusiness` y navega a `/auth`; si falla la red solo avisa con
  toast para reintentar).
- **Resultado**: Salir invalida la sesión y no deja estado residual.
- **Depende de**: T-FE-02, backend T-BE-03.
- **Verificación**: ✅ `hooks/useAuth.ts:75-97` (`clearBusiness` +
  `navigate('/auth')` en éxito y error);
  `services/auth.service.ts:50-65`;
  `pages/Settings.tsx:163-171` (botón Cerrar Sesión).

### [x] T-FE-05 · Guard de rutas admin (US-3)

- **Acción**: Crear `ProtectedRoute` que redirige a `/auth` si no hay
  negocio en el store; aplicarlo a `orders`, `supplies` y `settings`
  (rutas públicas `menu`, `cart`, `order-received` quedan fuera).
- **Resultado**: Sin sesión no se renderiza el panel admin.
- **Depende de**: T-FE-02.
- **Verificación**: ✅ `components/auth/ProtectedRoute.tsx`;
  `router.tsx` (admin anidadas bajo el guard).

---

## Resumen de verificación

| User Story                      | Tareas                          | Coincide con código |
| ------------------------------- | ------------------------------- | ------------------- |
| US-1 Crear instancia (registro) | T-BE-01, T-FE-01                | ✅                  |
| US-2 Login email + password     | T-BE-02, T-BE-04/05, T-FE-01/02 | ✅                  |
| US-3 Perfil + logout seguro     | T-BE-03/04/05, T-FE-03/04/05    | ✅                  |

**Total de tareas**: 10 (5 backend + 5 frontend).
**Bloqueadas por gap de plan**: 0.
**Notas**: el `refresh` (T-BE-04) es soporte de sesión, no user story; el
registro es público por diseño (cada quien crea su instancia; no hay
gestión de usuarios).
