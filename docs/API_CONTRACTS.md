# Documentación de Endpoints

Este documento detalla los endpoints disponibles.

## Resumen de Endpoints

Prefijo base: `/api`

| Método | Ruta                 | Descripción                                 |
| :----- | :------------------- | :------------------------------------------ |
| POST   | `/auth/register`     | Registra un nuevo usuario.                  |
| POST   | `/auth/login`        | Inicia sesión un usuario.                   |
| GET    | `/orders`            | Obtiene todos los pedidos.                  |
| GET    | `/orders/:id`        | Obtiene un pedido por ID.                   |
| POST   | `/orders`            | Crea un nuevo pedido.                       |
| PATCH  | `/orders/:id`        | Actualiza el estado de un pedido.           |
| GET    | `/supplies/:type_id` | Lista los insumos por ID de tipo de insumo. |
| POST   | `/supplies`          | Crea un nuevo insumo.                       |
| GET    | `/types-supplies`    | Obtiene todos los tipos de insumos.         |
| POST   | `/types-supplies`    | Crea un nuevo tipo de insumo.               |

## Detalle de Endpoints

## Registrar Usuario

**Endpoint:** `POST /auth/register`

**Description:** Crea una nueva cuenta de usuario.

**Request Body:**

```json
{
  "name": "string", // Nombre del usuario (min 4, max 16 caracteres)
  "email": "string", // Correo electrónico (único, formato email)
  "password": "string" // Contraseña (min 6, max 12 caracteres)
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

**Description:** Inicia sesión un usuario.

**Request Body:**

```json
{
  "email": "string", // Correo electrónico (único, formato email)
  "password": "string" // Contraseña (min 6, max 12 caracteres)
}
```

**Response:**

### Success

```json
{
  "status": 200,
  "data": {
    "sub": "string",
    "name": "string"
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

## Obtener todos los pedidos

**Endpoint:** `GET /orders`

**Response:**

### Success

```json
{
  "status": 200,
  "data": [
    {
      "id": "string",
      "guest_name": "string",
      "created_at": "string",
      "status": "string",
      "supplies": [
        {
          "quantity": "number",
          "name": "string",
          "price": "number"
        }
      ],
      "observations": "string",
      "total": "number"
    }
  ]
}
```

## Obtener un pedido por ID

**Endpoint:** `GET /orders/:id`

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
        "price": "number"
      }
    ],
    "observations": "string",
    "total": "number",
    "type_pay": "string"
  }
}
```

## Crear Pedido

**Endpoint:** `POST /orders`

**Description:** Crea un nuevo pedido.

**Request Body:**

```json
{
  "name": "string",
  "observations": "string", // Opcional
  "total": "number",
  "supplies": [
    {
      "id": "string",
      "quantity": "number",
      "price": "number"
    }
  ]
}
```

**Response:**

### Success

```json
{
  "status": 201,
  "data": {
    "id": "string"
  }
}
```

## Actualizar estado de un pedido

**Endpoint:** `PATCH /orders/:id`

**Description:** Actualiza el estado de un pedido.

**Request Body:**

```json
{
  "status": "FINISHED"
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

## Obtener todas las categorías de insumos

**Endpoint:** `GET /types-supplies`

**Description:** Obtiene todas las categorías de insumos.

**Response:**

### Success

```json
{
  "status": 200,
  "data": [
    {
      "id": "string",
      "name": "string",
      "layout": "string"
    }
  ]
}
```

### Error

```json
{
  "status": 400,
  "code": "CATEGORY_NOT_FOUND",
  "message": "La categoría especificada no existe"
}
```

## Crear Tipo de Insumo

**Endpoint:** `POST /types-supplies`

**Description:** Crea una nueva categoría para agrupar insumos.

**Request Body:**

```json
{
  "name": "string", // Nombre de la categoría
  "layout": "string" // FULL o HALF (opcional)
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

## Listar Insumos por Categoría

**Endpoint:** `GET /supplies/:type_id`

**Description:** Obtiene todos los insumos que pertenecen a una categoría específica.

**Response:**

### Success

```json
{
  "status": 200,
  "data": [
    {
      "id": "string",
      "image_url": "string",
      "name": "string",
      "description": "string",
      "price": 0
    }
  ]
}
```

### Error

```json
{
  "status": 400,
  "code": "CATEGORY_NOT_FOUND",
  "message": "La categoría especificada no existe"
}
```

## Crear Insumo

**Endpoint:** `POST /supplies`

**Description:** Crea un nuevo insumo asociado a una categoría.

**Request Body:**

```json
{
  "name": "string",
  "description": "string", // Opcional
  "price": "number",
  "image_url": "string", // Opcional
  "type_supply_id": "string", // UUID de la categoría
  "status": "string" // AVAILABLE o UNAVAILABLE (opcional)
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
