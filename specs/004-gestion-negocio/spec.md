# Specification: 004-gestion-negocio

- **Date**: 2026-08-26
- **Status**: [Completed]
- **Branch**: [004-gestion-negocio]

## Resumen

Permite al usuario administrador gestionar la información y disponibilidad de su propio
negocio desde el panel de administración: visualizar su perfil (nombre del propietario,
nombre del negocio y teléfono), abrir o cerrar el negocio para controlar si el menú
público está disponible, y configurar la cantidad de mesas disponibles. Esta
especificación describe el **comportamiento deseado** para la gestión del negocio.

| #   | User Story                                                  | Prioridad | Estado    |
| --- | ----------------------------------------------------------- | --------- | --------- |
| 1   | Visualizar perfil (propietario, negocio, teléfono)          | P1        | Completed |
| 2   | Abrir o cerrar el negocio (disponibilidad del menú público) | P1        | Completed |
| 3   | Configurar la cantidad de mesas disponibles                 | P2        | Completed |

## Problema

El administrador no cuenta con una vista centralizada de su negocio ni control sobre su
disponibilidad. No puede (a) consultar rápidamente los datos de su perfil, (b) abrir o
cerrar el negocio para habilitar/inhabilitar el menú público de sus clientes, ni
(c) definir cuántas mesas ofrece, lo que afecta la experiencia de pedido en local
(selector de mesa). Esto perjudica la operación diaria y la coherencia entre el panel
administrativo y el flujo de pedido público.

## User Scenarios _(mandatory)_

### User Story 1 - Visualizar el perfil del negocio (Priority: P1)

El administrador visualiza los datos de su negocio: nombre del propietario, nombre del
negocio y teléfono.

**Scenarios**:

1. administrador accede a la sección de perfil/ajustes → el sistema muestra el nombre del
   propietario, el nombre del negocio y el teléfono registrados.
2. algún dato no está configurado → el sistema lo indica como vacío/incompleto sin fallar.
3. administrador recarga la página → los datos del perfil se vuelven a cargar desde el
   servidor (no se pierden).

---

### User Story 2 - Abrir o cerrar el negocio (Priority: P1)

El administrador alterna el estado de apertura del negocio para controlar la disponibilidad
del menú público de los clientes.

**Scenarios**:

1. administrador abre el negocio → el sistema marca el negocio como abierto y habilita el
   menú público (`/:slug/menu`).
2. administrador cierra el negocio → el sistema marca el negocio como cerrado y el menú
   público se muestra no disponible.
3. cliente consulta el menú mientras el negocio está cerrado → el sistema informa que el
   negocio está cerrado (vía estado/SSE).
4. administrador cambia el estado → se notifica a los clientes conectados (stream de
   apertura/cierre).

---

### User Story 3 - Configurar la cantidad de mesas disponibles (Priority: P2)

El administrador define cuántas mesas tiene disponibles su negocio; este valor alimenta el
selector de mesa del pedido en local. La cantidad de mesas se mantiene **solo en el store
del frontend** (estado del cliente), sin persistencia en el backend.

**Scenarios**:

1. administrador ingresa una cantidad N de mesas → el sistema guarda `table_count = N` en
   el store del cliente.
2. cliente elige consumo en local → el sistema muestra una grilla de N mesas (basada en
   `table_count`).
3. administrador configura 0 mesas → el sistema no ofrece mesas para pedidos en local.
4. administrador ingresa un valor no numérico o negativo → el sistema lo rechaza.

## Casos Borde

- Negocio cerrado → el menú público se muestra como no disponible y el pedido en local no
  procede.
- `table_count` no configurado → se asume un valor por defecto (p. ej. 10) hasta que el
  admin lo defina.
- Datos de perfil vacíos → se visualizan como incompletos, sin bloquear la vista.
- Concurrencia: si dos sesiones del admin cambian el estado, la última escritura prevalece
  y se notifica a los clientes.
- Cambio de `table_count` a un valor menor que las mesas ya seleccionadas en pedidos en
  curso → no afecta pedidos ya confirmados (PENDING).

## Requisitos _(mandatory)_

### Requisitos funcionales

- El sistema DEBE mostrar el perfil del negocio con nombre del propietario, nombre del
  negocio y teléfono.
- El sistema DEBE permitir al admin abrir y cerrar el negocio, persistiendo el estado en el
  backend.
- El sistema DEBE reflejar el estado de apertura en el menú público (abierto/disponible vs.
  cerrado/no disponible).
- El sistema DEBE permitir configurar la cantidad de mesas (`table_count`) del negocio en
  el store del cliente.
- El sistema DEBE usar `table_count` para definir la grilla de mesas en el pedido en local.
- El sistema DEBE notificar a los clientes conectados cuando cambia el estado de apertura.

### Requisitos de seguridad

- Solo el administrador autenticado (ADMIN/SUPER_ADMIN) puede ver y modificar los datos de
  su propio negocio; las rutas son protegidas por `AdminGuard`.
- Un admin no puede gestionar el negocio de otro admin (aislamiento por cuenta/`slug`).
- El estado de apertura del negocio se comunica al cliente vía SSE sin exponer datos
  sensibles de otros negocios.

## Fuera de alcance

- Edición de los valores del perfil (nombre del propietario, nombre del negocio, teléfono):
  US1 solo requiere **visualizarlos**; la edición es otra iteración.
- **Persistencia de `table_count` en el backend**: la cantidad de mesas vive únicamente en
  el store del cliente (frontend); no se crea columna ni endpoint para guardarla.
- Gestión de múltiples negocios por cuenta (cada cuenta = un negocio).
- Horarios de apertura/cierre automáticos o programados.
- Asignación de mesas a pedidos específicos más allá de `guest_name = "Mesa N"`.
- Suscripciones/planes del negocio (modelo `Subscriptions` no participa aquí).

## Criterios de éxito _(mandatory)_

### Resultados medibles

- 100% de los admins ven su perfil (propietario, negocio, teléfono) al abrir la sección.
- 100% de los cambios de apertura se reflejan en el menú público y en el stream de clientes.
- 100% de las configuraciones de `table_count` válidas se guardan en el store del cliente.
- 0 cambios de apertura aplicados a otro negocio.
- 100% de valores inválidos de `table_count` (negativo/no numérico) son rechazados.

## Supuestos

- Cada cuenta de usuario administrador gestiona un único negocio (los campos de negocio
  viven en el modelo de usuario, identificado por `slug`).
- El negocio se identifica por `slug`; el admin autenticado opera sobre su propio registro.
- El modelo de usuario ya cuenta con `name` (propietario), `business_name`, `phone` e
  `is_business_open`.
- El estado de apertura ya se comunica al cliente vía SSE (`/auth/stream/:slug`); US2
  reutiliza ese mecanismo.
- La cantidad de mesas (`table_count`) es un estado puramente de frontend: el admin la
  configura en el panel y se guarda en el store del cliente; la grilla de mesas del pedido
  en local (spec 003) la consume desde ese store.
