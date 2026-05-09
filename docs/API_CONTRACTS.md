# Documentación de Endpoints

Este documento detalla los endpoints disponibles.

## Resumen de Endpoints

Prefijo base: `/api`

| Método | Ruta             | Descripción                |
| :----- | :--------------- | :------------------------- |
| POST   | `/auth/register` | Registra un nuevo usuario. |
| POST   | `/auth/login`    | Inicia sesión un usuario.  |

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
