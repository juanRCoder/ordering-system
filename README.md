# Ordering System

Sistema de pedidos para restaurantes o negocios de comida: los clientes navegan el menú, arman su carrito y hacen pedidos (para consumir en el local o para llevar), mientras el administrador gestiona insumos, categorías y pedidos desde un panel propio, con actualización en tiempo real.

> Monorepo de pnpm con `backend/` (NestJS + Prisma + PostgreSQL) y `frontend/` (React + Vite + Tailwind CSS).

## Características

- **Menú del cliente**: catálogo de insumos por categoría, búsqueda por nombre y paginación.
- **Carrito y pedidos**: pedidos de tipo local (`LOCAL`) o para llevar (`TAKEAWAY`), con observaciones y pago en efectivo o YAPE.
- **Panel de administración**: gestión de insumos (con subida de imágenes a Cloudinary), categorías y pedidos, con filtros por estado y rango de fechas.
- **Tiempo real**: streams SSE para el estado del negocio (abierto/cerrado), actualizaciones de precios y nuevos pedidos.
- **Autenticación**: login/registro con JWT + refresh token en cookies httpOnly y sesiones persistidas.
- **Roles y suscripciones**: `USER`, `ADMIN`, `SUPER_ADMIN` y planes de suscripción (`FREE_TRIAL`, `MONTHLY`, `SEMI_ANNUAL`, `ANNUAL`).

## Stack tecnológico

| Capa     | Tecnologías                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------ |
| Frontend | React 19, Vite 8, Tailwind CSS v4, shadcn/ui (base-ui), Zustand, TanStack Query, React Hook Form + Zod |
| Backend  | NestJS 11, Prisma 7, PostgreSQL 16, JWT + Passport, Cloudinary, Multer, SSE                            |
| Infra    | Docker (PostgreSQL 16), pnpm workspaces                                                                |

## Estructura del proyecto

```
ordering-system/
├─ backend/
│  ├─ prisma/
│  │  ├─ schema.prisma          # Modelo de datos
│  │  ├─ migrations/            # Migraciones SQL
│  │  └─ seed.ts                # Datos iniciales
│  └─ src/
│     ├─ main.ts                # Bootstrap (prefix /api, CORS, filtros)
│     ├─ config/                # Configuración por entorno (@nestjs/config)
│     ├─ common/                # Filtros, interceptores, decoradores
│     └─ features/
│        ├─ auth/               # Autenticación y estado del negocio
│        ├─ categories/         # Categorías de insumos
│        ├─ supplies/           # Insumos y precios por admin
│        └─ orders/             # Pedidos y confirmación
└─ frontend/
   └─ src/
      ├─ pages/                 # Vistas por ruta
      │  └─ admin/              # Panel de administración
      ├─ components/            # UI (shadcn/ui + componentes propios)
      ├─ hooks/                 # Data fetching (TanStack Query)
      ├─ stores/                # Estado global (Zustand)
      └─ interfaces/            # Tipos compartidos con el API
```

## Requisitos previos

- **Node.js** >= 20
- **pnpm** >= 9
- **Docker** (para PostgreSQL 16)

## Puesta en marcha

### 1. Instalar dependencias

```bash
pnpm install
```

> Si ya existía un lockfile desactualizado, usa `pnpm install --force`.

### 2. Configurar variables de entorno

Backend:

```bash
cp backend/.env.example backend/.env
```

Frontend:

```bash
cp frontend/.env.example frontend/.env
```

Completa los valores según la sección [Variables de entorno](#variables-de-entorno).

### 3. Levantar la base de datos

```bash
pnpm --filter backend docker:up
```

### 4. Generar cliente Prisma, aplicar migraciones y sembrar datos

```bash
pnpm --filter backend exec prisma generate
pnpm --filter backend exec prisma migrate deploy
pnpm --filter backend db:seed
```

### 5. Iniciar en modo desarrollo

```bash
pnpm --filter backend start:dev     # API en http://localhost:3003/api
pnpm --filter frontend dev          # Frontend en http://localhost:5173
```

## Variables de entorno

### Backend (`backend/.env`)

| Variable            | Descripción                                          |
| ------------------- | ---------------------------------------------------- |
| `PORT`              | Puerto del servidor (por defecto `3003`).            |
| `DATABASE_PASSWORD` | Contraseña del usuario `postgres` de la base Docker. |
| `DATABASE_DATABASE` | Nombre de la base de datos.                          |
| `DATABASE_URL`      | Cadena de conexión `postgresql://...`.               |
| `JWT_SECRET`        | Secreto para firmar los tokens JWT.                  |
| `CORS_ORIGINS`      | Orígenes permitidos, separados por coma.             |

### Frontend (`frontend/.env`)

| Variable       | Descripción                  |
| -------------- | ---------------------------- |
| `VITE_API_DEV` | URL de la API de desarrollo. |

## Scripts

### Raíz

| Comando             | Descripción                    |
| ------------------- | ------------------------------ |
| `pnpm back:lint`    | Lint del backend.              |
| `pnpm front:lint`   | Lint del frontend.             |
| `pnpm format:check` | Verifica formato con Prettier. |
| `pnpm format:fix`   | Corrige formato con Prettier.  |

### Backend (`pnpm --filter backend`)

| Comando       | Descripción                                    |
| ------------- | ---------------------------------------------- |
| `start:dev`   | Inicia en modo watch.                          |
| `build`       | Compila el proyecto.                           |
| `lint`        | ESLint.                                        |
| `test`        | Tests unitarios (Jest).                        |
| `test:e2e`    | Tests end-to-end (`test/jest-e2e.json`).       |
| `docker:up`   | Levanta PostgreSQL 16 vía Docker Compose.      |
| `docker:down` | Detiene y elimina los volúmenes de PostgreSQL. |
| `db:seed`     | Ejecuta el seed de datos iniciales.            |

### Frontend (`pnpm --filter frontend`)

| Comando   | Descripción                               |
| --------- | ----------------------------------------- |
| `dev`     | Servidor de desarrollo (Vite).            |
| `build`   | Compila TypeScript + build de producción. |
| `lint`    | ESLint.                                   |
| `preview` | Previsualiza el build de producción.      |

## API

Prefijo global: `/api`. Autenticación vía cookies httpOnly (`auth-token` y `refresh-token`) con refresco automático de sesión.

### Autenticación

| Método | Ruta                         | Descripción                                      |
| ------ | ---------------------------- | ------------------------------------------------ |
| POST   | `/api/auth/register`         | Registro de usuario.                             |
| POST   | `/api/auth/login`            | Login, emite cookies de acceso y refresco.       |
| POST   | `/api/auth/refresh`          | Refresca el token de acceso.                     |
| POST   | `/api/auth/logout`           | Cierra sesión y limpia cookies.                  |
| PATCH  | `/api/auth/is-business-open` | Abre/cierra el negocio (requiere admin).         |
| SSE    | `/api/auth/stream/:slug`     | Stream del estado del negocio (abierto/cerrado). |

### Categorías

| Método | Ruta                  | Descripción                           |
| ------ | --------------------- | ------------------------------------- |
| GET    | `/api/categories`     | Lista todas las categorías.           |
| GET    | `/api/categories/:id` | Detalle de una categoría.             |
| POST   | `/api/categories`     | Crea categoría (requiere admin).      |
| PATCH  | `/api/categories/:id` | Actualiza categoría (requiere admin). |
| DELETE | `/api/categories/:id` | Elimina categoría (requiere admin).   |

### Insumos

| Método | Ruta                                | Descripción                                     |
| ------ | ----------------------------------- | ----------------------------------------------- |
| GET    | `/api/supplies/by-slug/:slug`       | Insumos públicos de un negocio (filtro/página). |
| GET    | `/api/supplies/:id`                 | Detalle de un insumo.                           |
| GET    | `/api/supplies`                     | Insumos del admin (requiere admin).             |
| POST   | `/api/supplies`                     | Crea insumo con imagen (requiere admin).        |
| PATCH  | `/api/supplies/:id`                 | Actualiza insumo (requiere admin).              |
| PATCH  | `/api/supplies/:id/status`          | Cambia disponibilidad (requiere admin).         |
| SSE    | `/api/supplies/stream/:slug/status` | Aviso de cambios de estado en tiempo real.      |
| SSE    | `/api/supplies/stream/:slug/price`  | Aviso de cambios de precio en tiempo real.      |

### Pedidos

| Método | Ruta                       | Descripción                                 |
| ------ | -------------------------- | ------------------------------------------- |
| GET    | `/api/orders`              | Pedidos del admin (filtros/requiere admin). |
| GET    | `/api/orders/:id`          | Detalle de un pedido.                       |
| POST   | `/api/orders/:slug`        | Crea pedido para un negocio.                |
| PATCH  | `/api/orders/:id`          | Actualiza pedido (requiere admin).          |
| PATCH  | `/api/orders/:id/confirm`  | Confirma pedido (requiere admin).           |
| DELETE | `/api/orders/:id`          | Elimina pedido (requiere admin).            |
| SSE    | `/api/orders/stream/:slug` | Aviso de nuevos pedidos en tiempo real.     |

## Modelo de datos

| Modelo           | Descripción                                                   |
| ---------------- | ------------------------------------------------------------- |
| `Users`          | Usuarios con rol (`USER`, `ADMIN`, `SUPER_ADMIN`).            |
| `Sessions`       | Sesiones de refresco de token por usuario.                    |
| `Subscriptions`  | Plan y estado de suscripción del admin.                       |
| `Categories`     | Categorías de insumos.                                        |
| `Supplies`       | Insumos base (catálogo de la plataforma o propios del admin). |
| `AdminSupplies`  | Precio, descripción y disponibilidad del insumo por admin.    |
| `Orders`         | Pedidos con tipo (local/para llevar), pago y total.           |
| `SuppliesOrders` | Líneas de pedido (insumo, cantidad, precio, observaciones).   |

## Rutas del frontend

| Ruta                             | Descripción               |
| -------------------------------- | ------------------------- |
| `/` · `/auth`                    | Autenticación.            |
| `/:slug/menu`                    | Menú del negocio.         |
| `/:slug/cart`                    | Carrito.                  |
| `/:slug/order-received/:orderId` | Confirmación del pedido.  |
| `/:slug/orders`                  | Panel de pedidos (admin). |
| `/:slug/supplies`                | Panel de insumos (admin). |
| `/:slug/settings`                | Ajustes del negocio.      |

## Calidad

- **Lint**: ESLint en `backend/` y `frontend/` (sin variables sin usar en backend).
- **Formato**: Prettier (comillas simples, punto y coma, sangría de 2 espacios).
- **Hooks de Git**: husky + lint-staged (ESLint fix + Prettier en `*.{ts,js,tsx,jsx}`) y commitlint con Conventional Commits.
- **Tests**: Jest unitarios en `backend/src` y end-to-end en `backend/test`.

## Autor

Juan Ramirez
