# Specification: 002-gestion-de-insumos

- **Date**: 2026-08-25
- **Status**: [Completed]

## Resumen

Permite al admin gestionar los insumos de su local: crear insumos propios (origen ADMIN)
vinculados a su `slug`, editarlos (totalmente los propios; solo nombre y precio los de
plataforma), y habilitar/deshabilitarlos para que el cambio se refleje en tiempo real en
el menú del cliente. Esta especificación **refleja el comportamiento actual del código**.

| #   | User Story                                          | Prioridad | Estado en código |
| --- | --------------------------------------------------- | --------- | ---------------- |
| 1   | Crear insumo propio para su local (slug)            | P1        | ✅ Implementado  |
| 2   | Editar insumos (propios y de plataforma)            | P1        | ✅ Implementado  |
| 3   | Habilitar/deshabilitar insumo con reflejo en tiempo | P1        | ✅ Implementado  |

## User Scenarios _(mandatory)_

### User Story 1 - Crear insumo propio para su local (Priority: P1)

El admin crea un insumo que pertenece únicamente a su local identificado por `slug`. Se
requieren los campos `name`, `price` y `category_id`, y la imagen se envía por separado
como buffer (binario en memoria).

**Scenarios**:

1. admin autenticado con rol ADMIN accede a la creación de insumo → el sistema solicita
   `name`, `price`, `category_id` e imagen.
2. admin envía los campos y la imagen (buffer) → el sistema crea el insumo con
   `origin = ADMIN` y `slug` del local.
3. admin omite `category_id` o `price` inválido → el sistema rechaza con error claro.
4. admin de otro local intenta crear insumo con `slug` ajeno → el sistema deniega la
   operación.

---

### User Story 2 - Editar insumos (Priority: P1)

El admin edita sus propios insumos (origen ADMIN) en su totalidad, y los insumos que le
proporciona la plataforma (origen PLATFORM) solo en `name` y `price`.

**Scenarios**:

1. admin edita un insumo propio → puede modificar `name`, `price`, `category_id` e
   imagen.
2. admin edita un insumo de plataforma → solo puede modificar `name` y `price`; cualquier
   otro campo es rechazado (`PLATFORM_SUPPLY_EDIT_FORBIDDEN`).
3. admin intenta editar un insumo de plataforma cambiando `category_id` o imagen → el
   sistema rechaza la operación.
4. insumo editado → el sistema persiste y refleja los cambios.

---

### User Story 3 - Habilitar/deshabilitar insumo con reflejo en tiempo real (Priority: P1)

El admin habilita o deshabilita un insumo; el cambio de disponibilidad se refleja de
inmediato en el menú del cliente vía actualización en tiempo real.

**Scenarios**:

1. admin deshabilita un insumo → su `status` pasa a UNAVAILABLE.
2. admin habilita un insumo → su `status` pasa a AVAILABLE.
3. cliente visualizando el menú → recibe la actualización en tiempo real y el insumo
   aparece/desaparece o cambia de estado sin recargar.
4. cambio de estado → se notifica vía el stream de disponibilidad del insumo.

## Casos Borde

- Imagen ausente o formato no permitido (no jpg/jpeg/png/webp) o > 5MB → el sistema
  rechaza la carga.
- `price` negativo o cero → rechazado.
- `category_id` inexistente → rechazado (`CATEGORY_NOT_FOUND`).
- Editar insumo inexistente o de otro `slug` → rechazado (`SUPPLY_NOT_FOUND`).
- Intentar editar `category_id` o imagen de un insumo de plataforma → rechazado
  (`PLATFORM_SUPPLY_EDIT_FORBIDDEN`).
- Deshabilitar un insumo que ya está UNAVAILABLE (o habilitar uno AVAILABLE) → acción
  idempotente.
- Cambio de estado concurrente → el último estado válido prevalece y se notifica.

## Requisitos _(mandatory)_

### Requisitos funcionales

- El sistema DEBE permitir al admin crear insumos propios (`origin = ADMIN`) vinculados a
  su `slug` con `name`, `price`, `category_id` e imagen (buffer).
- El sistema DEBE asociar todo insumo propio al `slug` del admin autenticado.
- El sistema DEBE permitir editar insumos propios en su totalidad.
- El sistema DEBE permitir editar insumos de plataforma (`origin = PLATFORM`) solo en
  `name` y `price`.
- El sistema DEBE permitir habilitar/deshabilitar insumos (cambio de `status`
  AVAILABLE/UNAVAILABLE).
- El sistema DEBE reflejar el cambio de disponibilidad en el menú del cliente en tiempo
  real.
- El sistema DEBE requerir autenticación y rol ADMIN para estas operaciones.
- El sistema DEBE validar la imagen (formato y tamaño) al crear/editar.

### Requisitos de seguridad

- El sistema REQUIERE `AdminGuard` (rol ADMIN) en `POST /api/supplies`,
  `PATCH /api/supplies/:id` y `PATCH /api/supplies/:id/status`. Los streams SSE son
  públicos. La edición de insumos de plataforma está restringida a `name` y `price` por
  el servicio (`PLATFORM_SUPPLY_EDIT_FORBIDDEN`). El admin solo opera sobre sus propias
  filas `adminSupplies` (`admin_id = adminId`).

### Entidades clave

- **Insumo**: id, `name`, `price`, `category_id`, `origin` (PLATFORM/ADMIN), `status`
  (AVAILABLE/UNAVAILABLE), `slug` (local), imagen (buffer/url).
- **Categoría**: id, nombre, asociada al local.

## Criterios de éxito _(mandatory)_

### Resultados medibles

- 100% de insumos creados quedan vinculados al `slug` correcto con `origin = ADMIN`.
- 100% de ediciones de insumos de plataforma restringidas solo a `name` y `price`.
- Cambio de estado de insumo reflejado en el menú cliente en menos de pocos segundos vía
  stream.
- 0 insumos creados por un admin aparecen en el local de otro `slug`.

## Supuestos

- El admin accede autenticado con rol ADMIN y su local se identifica por `slug`.
- Los insumos de plataforma son de solo lectura parcial (nombre y precio editables).
- La imagen se procesa como buffer en memoria (Multer memory storage) y se sube a
  Cloudinary.
- El menú cliente consume el stream de estado de insumos (`/supplies/stream/:slug/status`)
  para reflejar cambios en tiempo real.
- El sistema ya cuenta con autenticación, roles, categorías e insumos.
