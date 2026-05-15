# Documentación de Endpoints

Este documento detalla los endpoints disponibles.

## Resumen de Endpoints

Prefijo base: `/api`

| Método | Ruta                 | Descripción                            |
| :----- | :------------------- | :------------------------------------- |
| POST   | `/auth/register`     | Registra un nuevo usuario.             |
| POST   | `/auth/login`        | Inicia sesión un usuario.              |
| POST   | `/types-supplies`    | Crea una nueva categoría de insumo.    |
| POST   | `/supplies`          | Crea un nuevo insumo.                  |
| GET    | `/supplies/:type_id` | Lista los insumos por ID de categoría. |

## Detalle de Endpoints

### 1. Registrar Usuario

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

### 2. Iniciar Sesión

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
  "message": "User not found"
}
```

### 3. Crear Categoría de Insumo

**Endpoint:** `POST /types-supplies`

**Description:** Crea una nueva categoría para agrupar insumos.

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

### 4. Crear Insumo

**Endpoint:** `POST /supplies`

**Description:** Crea un nuevo insumo asociado a una categoría.

**Request Body:**

```json
{
  "name": "string",
  "description": "string", // Opcional
  "price": "number",
  "image_url": "string", // Opcional
  "type_supply_id": "string" // UUID de la categoría
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

### 5. Listar Insumos por Categoría

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
