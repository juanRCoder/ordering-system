# Documentación de Endpoints

Este documento detalla los endpoints disponibles.

## Resumen de Endpoints

Prefijo base: `/api`

| Método | Ruta                            | Descripción                                                       | Auth    |
| :----- | :------------------------------ | :---------------------------------------------------------------- | :------ |
| POST   | `/auth/register`                | Registra un nuevo negocio (usuario ADMIN).                        | Público |
| POST   | `/auth/login`                   | Inicia sesión y establece cookies de sesión.                      | Público |
| POST   | `/auth/refresh`                 | Renueva el token de acceso usando el refresh token.               | Refresh |
| POST   | `/auth/logout`                  | Cierra sesión y limpia las cookies.                               | Refresh |
| PATCH  | `/auth/is-business-open`        | Cambia el estado abierto/cerrado del negocio.                     | ADMIN   |
| GET    | `/auth/stream/:slug`            | SSE: estado abierto/cerrado del negocio en tiempo real.           | Público |
| GET    | `/orders`                       | Lista los pedidos del negocio (paginado, con filtros).            | ADMIN   |
| GET    | `/orders/:id`                   | Obtiene un pedido por ID.                                         | ADMIN   |
| POST   | `/orders/:slug`                 | Crea un pedido para un negocio por su slug.                       | Público |
| GET    | `/orders/stream/:slug`          | SSE: aviso de nuevos pedidos en tiempo real.                      | Público |
| PATCH  | `/orders/:id`                   | Actualiza estado, tipo de pago y tipo de pedido.                  | ADMIN   |
| PATCH  | `/orders/:id/confirm`           | Marca un pedido como confirmado o no.                             | ADMIN   |
| DELETE | `/orders/:id`                   | Elimina un pedido y sus insumos relacionados.                     | ADMIN   |
| GET    | `/supplies/by-slug/:slug`       | Lista los insumos de un negocio por su slug (público).            | Público |
| GET    | `/supplies/:id`                 | Obtiene un insumo por ID.                                         | Público |
| GET    | `/supplies`                     | Lista los insumos del admin (paginado, con filtros).              | ADMIN   |
| POST   | `/supplies`                     | Crea un nuevo insumo (multipart con imagen opcional).             | ADMIN   |
| PATCH  | `/supplies/:id/status`          | Alterna el estado AVAILABLE/UNAVAILABLE de un insumo.             | ADMIN   |
| GET    | `/supplies/stream/:slug/status` | SSE: aviso de cambios de estado de insumos.                       | ADMIN   |
| PATCH  | `/supplies/:id`                 | Actualiza el precio de un insumo (multipart con imagen opcional). | ADMIN   |
| GET    | `/supplies/stream/:slug/price`  | SSE: aviso de cambios de precio de insumos.                       | ADMIN   |
| GET    | `/categories`                   | Obtiene todas las categorías de insumos.                          | Público |
| GET    | `/categories/:id`               | Obtiene una categoría por ID.                                     | Público |
| POST   | `/categories`                   | Crea una nueva categoría.                                         | ADMIN   |
| PATCH  | `/categories/:id`               | Renombra una categoría.                                           | ADMIN   |
| DELETE | `/categories/:id`               | Elimina una categoría (solo si no tiene insumos asociados).       | ADMIN   |

> **Autenticación:** los endpoints protegidos con `ADMIN` requieren la cookie `auth-token` (JWT con rol `ADMIN` o `SUPER_ADMIN`, expira en 15 min). Los endpoints protegidos con `Refresh` requieren la cookie `refresh-token` (expira en 7 días). Ambas cookies se establecen en `POST /auth/login` y `POST /auth/refresh`.

## Detalle de Endpoints

## Registrar Usuario

**Endpoint:** `POST /auth/register`

**Description:** Crea una nueva cuenta de usuario con rol ADMIN y su slug de negocio.

**Request Body:**

```json
{
  "name": "string", // Opcional. Nombre del usuario (por defecto "Unknown")
  "email": "string", // Correo electrónico (único, formato email)
  "password": "string", // Contraseña (min 6 caracteres)
  "slug": "string", // Slug único del negocio
  "business_name": "string" // Nombre del negocio
}
```

**Response:**

### Success

```json
{
  "status": 201,
  "data": {
    "sub": "string",
    "name": "string"
  }
}
```

### Error

```json
{
  "status": 409,
  "code": "EMAIL_ALREADY_IN_USE",
  "message": "Email already in use"
}
```

## Iniciar Sesión

**Endpoint:** `POST /auth/login`

**Description:** Inicia sesión y establece las cookies `auth-token` (15 min) y `refresh-token` (7 días).

**Request Body:**

```json
{
  "email": "string", // Correo electrónico (formato email)
  "password": "string" // Contraseña (min 6 caracteres)
}
```

**Response:**

### Success

```json
{
  "status": 200,
  "data": {
    "name": "string",
    "role": "string",
    "business_name": "string",
    "slug": "string",
    "is_business_open": "boolean",
    "phone": "string",
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

### Error

```json
{
  "status": 401,
  "code": "USER_NOT_FOUND",
  "message": "Invalid credentials"
}

{
  "status": 401,
  "code": "INVALID_PASSWORD",
  "message": "Invalid credentials"
}
```

## Renovar Token de Acceso

**Endpoint:** `POST /auth/refresh`

**Description:** Renueva el token de acceso usando la cookie `refresh-token`. El refresh token anterior se invalida y se rota por uno nuevo (nuevas cookies `auth-token` y `refresh-token`).

**Response:**

### Success

```json
{
  "status": 200,
  "data": {
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

### Error

```json
{
  "status": 401,
  "code": "REFRESH_TOKEN_NOT_FOUND",
  "message": "Refresh token not found"
}

{
  "status": 401,
  "code": "INVALID_REFRESH_TOKEN",
  "message": "Refresh token inválido o expirado"
}
```

## Cerrar Sesión

**Endpoint:** `POST /auth/logout`

**Description:** Invalida la sesión (elimina el refresh token de la base de datos) y limpia las cookies.

**Response:**

### Success

```json
{
  "status": 200,
  "data": {
    "ok": true
  }
}
```

## Actualizar Estado del Negocio

**Endpoint:** `PATCH /auth/is-business-open`

**Description:** Cambia el estado abierto/cerrado del negocio del admin autenticado. Requiere privilegios de ADMIN.

**Request Body:**

```json
{
  "is_business_open": true
}
```

**Response:**

### Success

```json
{
  "status": 200,
  "data": {
    "ok": true
  }
}
```

## Stream de Estado del Negocio

**Endpoint:** `GET /auth/stream/:slug` (SSE - Server-Sent Events)

**Description:** Emite eventos cuando cambia el estado abierto/cerrado del negocio con el slug indicado.

**Evento:**

```json
{
  "data": {
    "is_business_open": true
  }
}
```

## Obtener todos los pedidos

**Endpoint:** `GET /orders`

**Description:** Lista los pedidos del negocio del admin autenticado. Requiere privilegios de ADMIN.

**Query Params:**

| Parámetro    | Tipo   | Descripción                                                         |
| :----------- | :----- | :------------------------------------------------------------------ |
| `page`       | number | Página a consultar (por defecto `1`).                               |
| `status`     | string | Estado: `PENDING` o `FINISHED` (por defecto `PENDING`).             |
| `dateFilter` | string | `today`, `yesterday` u `older` (solo aplica con `status=FINISHED`). |

**Response:**

### Success

```json
{
  "status": 200,
  "data": [
    {
      "id": "string",
      "status": "string",
      "guest_name": "string",
      "order_type": "string",
      "created_at": "string",
      "is_confirmed": "boolean",
      "total": "number"
    }
  ],
  "counts": {
    "pending": "number"
  },
  "metadata": {
    "pagination": {
      "total": "number",
      "totalPages": "number",
      "page": "number"
    }
  }
}
```

## Obtener un pedido por ID

**Endpoint:** `GET /orders/:id`

**Description:** Obtiene un pedido específico. Requiere privilegios de ADMIN.

**Response:**

### Success

```json
{
  "status": 200,
  "data": {
    "id": "string",
    "guest_name": "string",
    "created_at": "string",
    "status": "string",
    "supplies": [
      {
        "quantity": "number",
        "name": "string",
        "price": "number",
        "observations": "string"
      }
    ],
    "total": "number",
    "payment_type": "string",
    "order_type": "string"
  }
}
```

### Error

```json
{
  "status": 404,
  "code": "ORDER_NOT_FOUND",
  "message": "The order with ID :id does not exist"
}
```

## Crear Pedido

**Endpoint:** `POST /orders/:slug`

**Description:** Crea un nuevo pedido para el negocio con el slug indicado. Si se envía `order_id`, en lugar de crear uno nuevo, incrementa el total y las cantidades del pedido existente.

**Request Body:**

```json
{
  "supplies": [
    {
      "id": "string",
      "price": "number",
      "quantity": "number",
      "observations": "string" // Opcional
    }
  ],
  "guest_name": "string",
  "total": "number",
  "order_id": "string", // Opcional. ID de un pedido existente para agregar items
  "order_type": "LOCAL" // Opcional. "LOCAL" o "TAKEAWAY" (por defecto "LOCAL")
}
```

**Response:**

### Success

```json
{
  "status": 201,
  "data": {
    "order_id": "string"
  }
}
```

### Error

```json
{
  "status": 404,
  "code": "ADMIN_NOT_FOUND",
  "message": "The admin with slug \"slug\" does not exist"
}

{
  "status": 404,
  "code": "ORDER_NOT_FOUND",
  "message": "The order with ID :order_id does not exist"
}

{
  "status": 400,
  "code": "SUPPLY_NOT_FOUND",
  "message": "The supply with ID :id does not exist"
}

{
  "status": 400,
  "code": "SUPPLY_NOT_AVAILABLE",
  "message": "The supply with ID :id is not available"
}

{
  "status": 400,
  "code": "SUPPLY_PRICE_MISMATCH",
  "message": "The price of supply with ID :id does not match"
}
```

## Stream de Pedidos

**Endpoint:** `GET /orders/stream/:slug` (SSE - Server-Sent Events)

**Description:** Emite un aviso cada vez que se crea o modifica un pedido en el negocio con el slug indicado.

**Evento:**

```json
{
  "data": {
    "updated": true
  }
}
```

## Actualizar Pedido

**Endpoint:** `PATCH /orders/:id`

**Description:** Actualiza el estado, tipo de pago y tipo de pedido de una orden. Requiere privilegios de ADMIN.

**Request Body:**

```json
{
  "status": "FINISHED", // "PENDING" o "FINISHED"
  "payment_type": "CASH", // "CASH" o "YAPE" (por defecto "CASH")
  "order_type": "LOCAL" // "LOCAL" o "TAKEAWAY" (por defecto "LOCAL")
}
```

**Response:**

### Success

```json
{
  "status": 201,
  "data": {
    "ok": true
  }
}
```

### Error

```json
{
  "status": 404,
  "code": "ORDER_NOT_FOUND",
  "message": "The order with ID :id does not exist"
}
```

## Confirmar Pedido

**Endpoint:** `PATCH /orders/:id/confirm`

**Description:** Marca un pedido como confirmado o no confirmado. Requiere privilegios de ADMIN.

**Request Body:**

```json
{
  "is_confirmed": true
}
```

**Response:**

### Success

```json
{
  "status": 200,
  "data": {
    "ok": true
  }
}
```

### Error

```json
{
  "status": 404,
  "code": "ORDER_NOT_FOUND",
  "message": "The order with ID :id does not exist"
}
```

## Eliminar un pedido por ID

**Endpoint:** `DELETE /orders/:id`

**Description:** Elimina un pedido y todos sus insumos relacionados por su ID. Requiere privilegios de ADMIN.

**Response:**

### Success

```json
{
  "status": 200,
  "data": {
    "ok": true
  }
}
```

### Error

```json
{
  "status": 404,
  "code": "ORDER_NOT_FOUND",
  "message": "The order with ID :id does not exist"
}
```

## Listar Insumos por Slug de Negocio

**Endpoint:** `GET /supplies/by-slug/:slug`

**Description:** Obtiene los insumos disponibles de un negocio por su slug (catálogo público).

**Query Params:**

| Parámetro    | Tipo   | Descripción                                                               |
| :----------- | :----- | :------------------------------------------------------------------------ |
| `categoryId` | string | Opcional. Filtra por categoría (se ignora si hay búsqueda por `letters`). |
| `letters`    | string | Opcional. Busca por nombre (insensible a mayúsculas).                     |
| `page`       | number | Página a consultar (por defecto `1`).                                     |

**Response:**

### Success

```json
{
  "status": 200,
  "is_business_open": "boolean",
  "data": [
    {
      "id": "string",
      "name": "string",
      "image_url": "string",
      "description": "string",
      "price": "number",
      "status": "string",
      "origin": "string"
    }
  ],
  "metadata": {
    "pagination": {
      "total": "number",
      "totalPages": "number",
      "page": "number"
    }
  }
}
```

### Error

```json
{
  "status": 404,
  "code": "ADMIN_NOT_FOUND",
  "message": "The business with slug \"slug\" does not exist"
}
```

## Listar Insumos del Admin

**Endpoint:** `GET /supplies`

**Description:** Obtiene los insumos del negocio del admin autenticado. Requiere privilegios de ADMIN.

**Query Params:**

| Parámetro    | Tipo   | Descripción                                                     |
| :----------- | :----- | :-------------------------------------------------------------- |
| `categoryId` | string | Filtra por categoría (se ignora si hay búsqueda por `letters`). |
| `letters`    | string | Opcional. Busca por nombre (insensible a mayúsculas).           |
| `page`       | number | Página a consultar (por defecto `1`).                           |

**Response:**

### Success

```json
{
  "status": 200,
  "is_business_open": "boolean",
  "data": [
    {
      "id": "string",
      "name": "string",
      "image_url": "string",
      "description": "string",
      "price": "number",
      "status": "string",
      "origin": "string"
    }
  ],
  "metadata": {
    "pagination": {
      "total": "number",
      "totalPages": "number",
      "page": "number"
    }
  }
}
```

## Obtener Insumo por ID

**Endpoint:** `GET /supplies/:id`

**Description:** Obtiene un insumo específico por su ID.

**Response:**

### Success

```json
{
  "status": 200,
  "data": {
    "id": "string",
    "name": "string",
    "image_url": "string",
    "description": "string",
    "price": "number",
    "category_id": "string",
    "image_public_id": "string"
  }
}
```

### Error

```json
{
  "status": 404,
  "code": "SUPPLY_NOT_FOUND",
  "message": "The specified supply does not exist"
}
```

## Crear Insumo

**Endpoint:** `POST /supplies`

**Description:** Crea un nuevo insumo asociado a una categoría y al admin autenticado. Requiere privilegios de ADMIN.

**Content-Type:** `multipart/form-data`

**Campos:**

| Campo         | Tipo   | Descripción                                        |
| :------------ | :----- | :------------------------------------------------- |
| `name`        | string | Nombre del insumo.                                 |
| `description` | string | Opcional. Descripción del insumo.                  |
| `price`       | number | Precio del insumo.                                 |
| `category_id` | string | UUID de la categoría.                              |
| `status`      | string | Opcional. `AVAILABLE` o `UNAVAILABLE`.             |
| `image_url`   | file   | Opcional. Imagen (jpg, jpeg, png, webp; máx 5 MB). |

**Response:**

### Success

```json
{
  "status": 201,
  "data": {
    "ok": true
  }
}
```

### Error

```json
{
  "status": 400,
  "code": "CATEGORY_NOT_FOUND",
  "message": "The specified category does not exist"
}
```

## Actualizar estado de un Insumo

**Endpoint:** `PATCH /supplies/:id/status`

**Description:** Cambia el estado de un insumo de AVAILABLE a UNAVAILABLE y viceversa. Requiere privilegios de ADMIN.

**Response:**

### Success

```json
{
  "status": 200,
  "data": {
    "name": "string",
    "status": "UNAVAILABLE"
  }
}
```

### Error

```json
{
  "status": 404,
  "code": "ADMIN_SUPPLY_NOT_FOUND",
  "message": "The specified supply does not exist"
}
```

## Stream de Estado de Insumos

**Endpoint:** `GET /supplies/stream/:slug/status` (SSE - Server-Sent Events)

**Description:** Emite un aviso cada vez que cambia el estado de un insumo del negocio con el slug indicado. Requiere privilegios de ADMIN.

**Evento:**

```json
{
  "data": {
    "updated": true
  }
}
```

## Actualizar Insumo

**Endpoint:** `PATCH /supplies/:id`

**Description:** Actualiza un insumo existente del admin autenticado. Actualmente solo aplica el cambio de `price`. Requiere privilegios de ADMIN.

**Content-Type:** `multipart/form-data`

**Campos (todos opcionales):**

| Campo             | Tipo   | Descripción                                        |
| :---------------- | :----- | :------------------------------------------------- |
| `name`            | string | Nombre del insumo.                                 |
| `description`     | string | Descripción del insumo.                            |
| `price`           | number | Precio del insumo.                                 |
| `image_url`       | string | URL de la imagen.                                  |
| `image_public_id` | string | ID público de la imagen en Cloudinary.             |
| `category_id`     | string | UUID de la categoría.                              |
| `image_url`       | file   | Opcional. Imagen (jpg, jpeg, png, webp; máx 5 MB). |

**Response:**

### Success

```json
{
  "status": 200,
  "data": {
    "ok": true
  }
}
```

### Error

```json
{
  "status": 404,
  "code": "SUPPLY_NOT_FOUND",
  "message": "The specified supply does not exist"
}
```

## Stream de Precio de Insumos

**Endpoint:** `GET /supplies/stream/:slug/price` (SSE - Server-Sent Events)

**Description:** Emite un aviso cada vez que cambia el precio de un insumo del negocio con el slug indicado. Requiere privilegios de ADMIN.

**Evento:**

```json
{
  "data": {
    "updated": true
  }
}
```

## Obtener todas las categorías

**Endpoint:** `GET /categories`

**Description:** Obtiene todas las categorías de insumos con la cantidad de insumos asociados.

**Response:**

### Success

```json
{
  "status": 200,
  "data": [
    {
      "id": "string",
      "name": "string",
      "supplies_quantity": "number"
    }
  ]
}
```

## Obtener una categoría por ID

**Endpoint:** `GET /categories/:id`

**Description:** Obtiene una categoría específica por su ID.

**Response:**

### Success

```json
{
  "status": 200,
  "data": {
    "id": "string",
    "name": "string"
  }
}
```

### Error

```json
{
  "status": 404,
  "code": "TYPE_SUPPLY_NOT_FOUND",
  "message": "The specified type supply does not exist"
}
```

## Crear Categoría

**Endpoint:** `POST /categories`

**Description:** Crea una nueva categoría para agrupar insumos. Requiere privilegios de ADMIN.

**Request Body:**

```json
{
  "name": "string" // Nombre de la categoría
}
```

**Response:**

### Success

```json
{
  "status": 201,
  "data": {
    "ok": true
  }
}
```

## Actualizar Categoría

**Endpoint:** `PATCH /categories/:id`

**Description:** Renombra una categoría existente. Requiere privilegios de ADMIN.

**Request Body:**

```json
{
  "name": "string" // Nuevo nombre de la categoría
}
```

**Response:**

### Success

```json
{
  "status": 200,
  "data": {
    "ok": true
  }
}
```

### Error

```json
{
  "status": 404,
  "code": "CATEGORY_NOT_FOUND",
  "message": "The specified category does not exist"
}
```

## Eliminar Categoría

**Endpoint:** `DELETE /categories/:id`

**Description:** Elimina una categoría. Solo se permite si la categoría no tiene insumos asociados. Requiere privilegios de ADMIN.

**Response:**

### Success

```json
// 204 No Content (sin cuerpo)
```

### Error

```json
{
  "status": 404,
  "code": "CATEGORY_NOT_FOUND",
  "message": "The specified category does not exist"
}

{
  "status": 409,
  "code": "CATEGORY_HAS_SUPPLIES",
  "message": "Cannot delete category with associated supplies"
}
```
