# Specification: 005-autenticacion

- **Date**: 2026-08-26
- **Status**: [Draft]
- **Branch**: [005-autenticacion]

## Resumen

Permite al usuario administrador acceder al sistema de forma segura mediante sus
credenciales (email y contraseña) y finalizar su sesión cuando lo desee. Esta
especificación describe el **comportamiento deseado** para la autenticación del admin.

| #   | User Story                            | Prioridad | Estado |
| --- | ------------------------------------- | --------- | ------ |
| 1   | Iniciar sesión con email y contraseña | P1        | Draft  |
| 2   | Cerrar sesión de forma segura         | P1        | Draft  |

## Problema

El administrador no tiene una forma controlada de acceder al panel del negocio ni de
terminar su sesión. Sin un login basado en credenciales, cualquiera podría alcanzar las
funciones administrativas; sin un logout seguro, la sesión queda expuesta en el cliente y
en el servidor. Esto pone en riesgo la gestión del negocio y los datos de los clientes.

## User Scenarios _(mandatory)_

### User Story 1 - Iniciar sesión con email y contraseña (Priority: P1)

El administrador ingresa su email y contraseña para autenticarse y acceder al sistema.

**Scenarios**:

1. admin ingresa email y contraseña válidos → el sistema lo autentica y lo redirige al
   panel (`/:slug/menu` o sección admin).
2. admin ingresa credenciales inválidas (email inexistente o contraseña incorrecta) → el
   sistema rechaza el acceso y muestra un error claro, sin indicar qué campo falló.
3. admin envía el formulario con campos vacíos → el sistema lo valida y pide completarlos.
4. admin ya autenticado intenta login nuevamente → el sistema renueva la sesión.

---

### User Story 2 - Cerrar sesión de forma segura (Priority: P1)

El administrador finaliza su sesión para salir del sistema sin dejar acceso residual.

**Scenarios**:

1. admin solicita cerrar sesión → el sistema invalida la sesión (lado servidor) y elimina
   las cookies de autenticación del cliente.
2. tras logout, admin intenta acceder a una ruta protegida → el sistema lo redirige al
   login.
3. admin cierra sesión desde un dispositivo → no afecta otras sesiones activas de otros
   dispositivos (si aplica).

## Casos Borde

- Email con formato inválido → rechazado en validación.
- Contraseña incorrecta tras varios intentos → se puede limitar la tasa (rate limit) sin
  bloquear necesariamente la cuenta.
- Token de acceso expirado → el cliente renueva vía refresh token sin pedir credenciales
  otra vez (si el flujo lo soporta).
- Logout con sesión ya inexistente/expirada → el sistema responde ok y limpia el cliente.
- Conexión insegura → las cookies de sesión viajan solo por HTTPS (secure).

## Requisitos _(mandatory)_

### Requisitos funcionales

- El sistema DEBE permitir iniciar sesión con email y contraseña.
- El sistema DEBE validar las credenciales y rechazar accesos inválidos.
- El sistema DEBE redirigir al admin autenticado a su panel.
- El sistema DEBE permitir cerrar sesión e invalidar la sesión.
- El sistema DEBE eliminar los tokens/cookies de autenticación del cliente al cerrar
  sesión.

### Requisitos de seguridad

- Las contraseñas NUNCA se almacenan en texto plano (se hashean).
- La sesión se mantiene con tokens en cookies httpOnly (no accesibles por JS) y con
  flag secure en producción.
- Las rutas administrativas están protegidas y requieren sesión/token válido.
- El logout invalida la sesión en el servidor (no solo borra la cookie del cliente).
- Se aplica rate limiting a los intentos de login para mitigar fuerza bruta.

## Fuera de alcance

- Registro de nuevos admins desde la UI pública (queda en otra iteración/spec).
- Recuperación de contraseña / reset por email.
- Autenticación con terceros (Google, etc.) y MFA.
- Roles distintos a ADMIN para el flujo de login (USER/SUPER_ADMIN no aplican aquí).
- Gestión de sesiones múltiples simultáneas explícitas (el logout invalida la actual).

## Criterios de éxito _(mandatory)_

### Resultados medibles

- 100% de logins con credenciales válidas otorgan acceso y sesión.
- 100% de credenciales inválidas son rechazadas con error claro.
- 100% de logouts invalidan la sesión en el servidor y limpian las cookies del cliente.
- 0 sesiones accesibles tras un logout correcto.
- 100% de rutas admin requieren sesión válida (sin bypass).

## Supuestos

- El admin ya existe en el sistema (cuenta creada por registro/seed); este spec cubre solo
  login y logout, no el alta de usuarios.
- La sesión usa tokens en cookies httpOnly (access + refresh) gestionados por el backend.
- El identificador del negocio (`slug`) se conoce tras autenticar y se usa para redirigir.
- El cliente maneja la renovación de token vía refresh sin intervención del usuario.
- El entorno de producción fuerza HTTPS para las cookies de sesión.
