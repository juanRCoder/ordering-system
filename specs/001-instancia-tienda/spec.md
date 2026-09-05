# Specification: 001-instancia-de-tienda

- **Date**: 2026-09-05
- **Status**: [Completed]

## Resumen

Permite crear una instancia de tienda (registro de cuenta), acceder con
email y contraseña, visualizar el perfil del negocio y cerrar sesión. Cada
cuenta administra una única tienda identificada por su `slug`. Esta
especificación **refleja el comportamiento actual del código** y absorbe el
contenido de la antigua spec `005-autenticacion` (eliminada).

| #   | User Story                                    | Prioridad | Estado en código |
| --- | --------------------------------------------- | --------- | ---------------- |
| 1   | Crear una instancia de tienda (registro)      | P1        | ✅ Implementado  |
| 2   | Iniciar sesión con email y contraseña         | P1        | ✅ Implementado  |
| 3   | Visualizar perfil del negocio y cerrar sesión | P1        | ✅ Implementado  |

## User Scenarios _(mandatory)_

### User Story 1 - Crear una instancia de tienda (Priority: P1)

El usuario crea su tienda enviando nombre, email, contraseña y los datos
del negocio (`slug`, `business_name`, `phone`). La cuenta nace con rol
`ADMIN` y su tienda queda identificada por el `slug`.

**Scenarios**:

1. usuario envía datos válidos → el sistema crea la cuenta ADMIN y la
   instancia queda disponible bajo su `slug`.
2. usuario usa un email ya registrado → el sistema rechaza con
   `EMAIL_ALREADY_IN_USE` (409).
3. usuario usa un `slug` ya registrado → el sistema rechaza con
   `SLUG_ALREADY_IN_USE` (409).
4. usuario envía campos vacíos o password de menos de 6 caracteres → el
   sistema rechaza con error de validación (400).

---

### User Story 2 - Iniciar sesión con email y contraseña (Priority: P1)

El usuario ingresa su email y contraseña para autenticarse y entra al panel
de su tienda (`/:slug/menu`).

**Scenarios**:

1. usuario ingresa email y contraseña válidos → el sistema lo autentica,
   emite las cookies de sesión, guarda su negocio en el store y lo redirige
   a `/:slug/menu`.
2. usuario ingresa email inexistente o contraseña incorrecta → el sistema
   rechaza con 401 y mensaje genérico (`Invalid credentials`); el `code`
   distingue el caso (`USER_NOT_FOUND` / `INVALID_PASSWORD`) solo para
   diagnóstico interno, y el cliente muestra un único aviso sin revelar el
   campo que falló.
3. usuario envía el formulario con campos vacíos → el sistema lo valida y
   pide completarlos.
4. usuario supera los intentos permitidos → el sistema limita la tasa
   (throttle de login) sin bloquear la cuenta.

---

### User Story 3 - Visualizar perfil del negocio y cerrar sesión (Priority: P1)

El usuario consulta los datos de su tienda (propietario, negocio, teléfono)
y puede finalizar su sesión de forma segura.

**Scenarios**:

1. usuario accede a su perfil/ajustes → el sistema muestra el nombre del
   propietario, el nombre del negocio y el teléfono registrados.
2. algún dato no está configurado → el sistema lo muestra como `N/A` sin
   fallar.
3. usuario solicita cerrar sesión → el sistema invalida la sesión en el
   servidor, limpia las cookies del cliente y lo redirige a `/auth`.
4. tras logout, el usuario intenta acceder a una ruta protegida
   (`orders`, `supplies`, `settings`) → el frontend lo redirige a `/auth`
   (`ProtectedRoute`) y la API responde 401 sin sesión válida.

## Casos Borde

- Email con formato inválido → rechazado en validación.
- `slug` con espacios o vacío → rechazado en validación.
- Cuenta antigua sin `slug` → el frontend usa el slug de respaldo
  (`caveflow`) para navegar y consultar, sin mostrar `/null/...`.
- Access token expirado → el cliente renueva vía refresh token sin pedir
  credenciales otra vez.
- Logout con sesión ya inexistente/expirada → el sistema responde ok y
  limpia el cliente.
- Registro concurrente con el mismo email/slug → gana una; la otra
  recibe 409 genérico sin código específico (solo el chequeo secuencial
  devuelve `EMAIL_ALREADY_IN_USE` / `SLUG_ALREADY_IN_USE`).

## Requisitos _(mandatory)_

### Requisitos funcionales

- El sistema DEBE permitir crear una instancia de tienda con `nombre`,
  `email`, `contraseña`, `slug`, `business_name` y `phone`.
- El sistema DEBE asignar rol `ADMIN` a toda cuenta creada por registro.
- El sistema DEBE garantizar `email` y `slug` únicos entre instancias.
- El sistema DEBE permitir iniciar sesión con email y contraseña.
- El sistema DEBE emitir la sesión en cookies httpOnly (`auth-token` y
  `refresh-token`).
- El sistema DEBE redirigir al usuario autenticado al menú de su tienda.
- El sistema DEBE mostrar el perfil del negocio con propietario, negocio y
  teléfono.
- El sistema DEBE permitir cerrar sesión invalidando la sesión en el
  servidor y limpiando cookies y store del cliente.

### Requisitos de seguridad

- Las contraseñas NUNCA se almacenan en texto plano (hash bcrypt).
- La sesión viaja en cookies httpOnly (no accesibles por JS), `secure` en
  producción y `path: '/api'`.
- Las rutas administrativas requieren sesión válida (`AdminGuard`, rol
  `ADMIN` o `SUPER_ADMIN`).
- El logout invalida la sesión en el servidor (borra `Sessions`), no solo
  la cookie del cliente.
- Se aplica rate limiting: registro 5/min, login 10/min, global 100/min.

### Entidades clave

- **Instancia de tienda** (`Users`): id, `name` (propietario), `email`
  (único), `slug` (único, identifica la tienda), `business_name`, `phone`,
  `role` (ADMIN), `is_business_open`.
- **Sesión** (`Sessions`): `refresh_token`, `user_id`, `expires_at`.

## Criterios de éxito _(mandatory)_

### Resultados medibles

- 100% de registros con datos válidos crean la cuenta ADMIN y su `slug`.
- 100% de emails o slugs duplicados son rechazados con 409 y código claro.
- 100% de logins válidos otorgan sesión, cookies y redirección al menú.
- 100% de credenciales inválidas son rechazadas con 401 y mensaje claro.
- 100% de logouts invalidan la sesión en servidor y limpian el cliente.
- 0 rutas admin accesibles sin sesión válida.

## Supuestos

- Cada cuenta administra una única tienda (los campos del negocio viven en
  el modelo de usuario, identificado por `slug`).
- El registro es público: cualquiera puede crear su propia instancia; no
  hay gestión de usuarios ni altas por invitación.
- El `slug` identifica la tienda en rutas (`/:slug/...`), consultas y
  streams; debe ser único y estable.
- La sesión usa access token (15m) + refresh token (7d) en cookies
  httpOnly gestionadas por el backend.
- El frontend guarda el negocio en el store tras el login y lo limpia tras
  el logout.
