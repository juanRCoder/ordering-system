# Specification: 003-pedido-publico

- **Date**: 2026-08-26
- **Status**: [Completed]
- **Branch**: [003-pedido-publico]

## Resumen

Permite al cliente (usuario final) realizar un pedido desde el menú público del local:
visualizar los insumos públicos organizados por categoría, agregarlos a un carrito,
configurar el tipo de consumo (en mesa o para llevar), seleccionar una mesa disponible
cuando aplica, registrar su nombre, ver el monto total y revisar un resumen final antes
de confirmar. Esta especificación describe el **comportamiento deseado** para la
funcionalidad de pedido público.

| #   | User Story                                             | Prioridad | Estado    |
| --- | ------------------------------------------------------ | --------- | --------- |
| 1   | Visualizar insumos públicos categorizados y agregarlos | P1        | Completed |
| 2   | Configurar pedido (mesa o para llevar)                 | P1        | Completed |
| 3   | Seleccionar mesa (consumo en local)                    | P2        | Completed |
| 4   | Ingresar nombre y visualizar monto total               | P1        | Completed |
| 5   | Visualizar resumen final antes de confirmar            | P1        | Completed |

## User Scenarios _(mandatory)_

### User Story 1 - Visualizar insumos públicos categorizados y agregarlos al carrito (Priority: P1)

El cliente accede al menú público del local y visualiza los insumos disponibles agrupados
por categoría; puede agregar cualquier insumo a su carrito de compras.

**Scenarios**:

1. cliente accede a `/:slug/menu` → el sistema muestra los insumos públicos AVAILABLE
   agrupados por categoría.
2. cliente selecciona un insumo → el sistema lo agrega al carrito (incrementa cantidad si
   ya existe).
3. cliente vuelve a seleccionar el mismo insumo → la cantidad en el carrito aumenta en 1.
4. insumo UNAVAILABLE → no es mostrado o se muestra deshabilitado, sin posibilidad de
   agregarlo.

---

### User Story 2 - Configurar pedido indicando si es para mesa o para llevar (Priority: P1)

El cliente indica el tipo de consumo de su pedido: en el local (mesa) o para llevar
(TAKEAWAY).

**Scenarios**:

1. cliente abre el carrito → el sistema solicita seleccionar el tipo de pedido
   (LOCAL / TAKEAWAY).
2. cliente elige "para llevar" → el sistema oculta la selección de mesa.
3. cliente elige "en el local" → el sistema habilita la selección de mesa (US3).
4. cliente no selecciona tipo → el sistema impide avanzar al resumen.

---

### User Story 3 - Seleccionar una mesa cuando el pedido es para el local (Priority: P2)

El cliente, habiendo elegido consumo en local, selecciona una mesa de la grilla del local.
La mesa **no es una entidad del backend**: al elegir la mesa N el sistema fija
`guest_name = "Mesa N"` (y solo eso).

**Scenarios**:

1. cliente elige LOCAL → el sistema muestra la grilla de mesas.
2. cliente selecciona la mesa N → el sistema fija `guest_name = "Mesa N"` para el pedido.
3. cliente cambia a TAKEAWAY → la selección de mesa se descarta y `guest_name` queda libre
   para que el cliente ingrese su nombre.

---

### User Story 4 - Ingresar nombre y visualizar el monto total del pedido (Priority: P1)

El cliente registra su nombre y visualiza en todo momento el monto total calculado a
partir de los insumos y cantidades del carrito.

**Scenarios**:

1. cliente ingresa su nombre en el formulario de pedido → el dato se guarda en el contexto
   del pedido.
2. cliente agrega/quita insumos del carrito → el monto total se recalcula y se muestra.
3. cliente omite el nombre → el sistema impide confirmar el pedido.
4. monto total → es la suma de (precio × cantidad) de cada insumo del carrito.

---

### User Story 5 - Visualizar un resumen final de mi pedido antes de confirmarlo (Priority: P1)

El cliente revisa un resumen con los insumos, cantidades, tipo de pedido, mesa (si aplica,
reflejada como `guest_name = "Mesa N"`), nombre y monto total antes de confirmar.

**Scenarios**:

1. cliente avanza al resumen → el sistema muestra insumos, cantidades, total, tipo de
   pedido y mesa (si LOCAL, como `guest_name = "Mesa N"`).
2. cliente detecta un error → puede volver a editar el carrito o la configuración.
3. cliente confirma → el sistema crea la orden (PENDING) asociada al `slug` del local.
4. cliente confirma sin nombre o sin tipo → el sistema lo impide.

## Casos Borde

- Carrito vacío → el cliente no puede avanzar al resumen ni confirmar.
- Insumo que pasa a UNAVAILABLE estando en el carrito → se notifica y se impide confirmar.
- Total calculado con descuentos/promociones → fuera de alcance (no aplica).
- Cliente recarga la página → el estado del carrito y pedido persiste (store).
- Mesa ya seleccionada y el cliente vuelve a LOCAL → la última mesa elegida se reaplica
  como `guest_name = "Mesa N"`.
- Nombre con formato inválido (vacío/espacios) → rechazado.
- Confirmar dos veces → la segunda creación es evitada (orden ya generada).

## Requisitos _(mandatory)_

### Requisitos funcionales

- El sistema DEBE mostrar los insumos públicos AVAILABLE agrupados por categoría.
- El sistema DEBE permitir agregar, incrementar y quitar insumos del carrito.
- El sistema DEBE permitir configurar el tipo de pedido (LOCAL / TAKEAWAY).
- El sistema DEBE mostrar una grilla de mesas cuando el pedido es LOCAL y, al elegir la
  mesa N, fijar `guest_name = "Mesa N"`.
- El sistema DEBE solicitar el nombre del cliente y validarlo.
- El sistema DEBE calcular y mostrar el monto total en todo momento.
- El sistema DEBE mostrar un resumen final antes de confirmar.
- El sistema DEBE crear la orden (PENDING) al confirmar, asociada al `slug` del local.
- El sistema DEBE impedir confirmar sin nombre, sin tipo o con carrito vacío.

### Requisitos de seguridad

- El flujo de pedido público es accesible sin autenticación (cliente final).
- La creación de la orden debe validar que los insumos pertenezcan al `slug` y estén
  AVAILABLE.
- La selección de mesa solo aplica a pedidos LOCAL y fija `guest_name = "Mesa N"`.

### Entidades clave

- **Insumo público**: id, nombre, precio, categoría, `status` (AVAILABLE/UNAVAILABLE),
  `slug` del local.
- **Carrito**: lista de insumos con cantidad, total calculado.
- **Pedido (orden)**: tipo (LOCAL/TAKEAWAY), `guest_name` (para LOCAL vale `"Mesa N"`;
  para TAKEAWAY el nombre del cliente), insumos, total, estado (PENDING).

## Criterios de éxito _(mandatory)_

### Resultados medibles

- 100% de los insumos AVAILABLE se agrupan correctamente por categoría en el menú.
- El monto total refleja la suma (precio × cantidad) en el 100% de los casos.
- 100% de confirmaciones con nombre, tipo y carrito válidos generan una orden PENDING.
- 0 pedidos confirmados sin nombre, sin tipo o con carrito vacío.
- La selección de mesa quedará reflejada como `guest_name = "Mesa N"` en el 100% de los
  pedidos LOCAL confirmados.

## Supuestos

- El local se identifica por `slug` en la ruta pública.
- El cliente no requiere autenticación para realizar el pedido.
- El catálogo de insumos y categorías del local ya existe y es gestionado por el admin.
- El carrito se mantiene en el estado del frontend (store) hasta la confirmación.
- La "mesa" no es una entidad del backend: la selección de mesa es una experiencia de
  usuario que fija `guest_name = "Mesa N"`; para TAKEAWAY el cliente ingresa su nombre.
- La confirmación crea una orden en estado PENDING; la confirmación administrativa
  (`is_confirmed`) es responsabilidad del backend/admin (ver spec 001).
