# Ordering System

Sistema de pedidos para restaurantes o negocios de comida: Los meseros son asistidos por una carta y anotan(para consumir en el local o llevar), mientras que en cocina se registran en tiempo real todos esos pedidos a preparar.

### Flujo Principal:

1. El mesero accede al menú.
2. Explora y selecciona insumos.
3. Agrega insumos al carrito.
4. Ordena el pedido.
5. Cocina recibe y prepara el pedido.
6. El estado del pedido se actualiza en tiempo real desde cocina o caja.

### Características

- [x] **Menú del cliente**: catálogo de insumos por categoría, búsqueda por nombre y paginación.
- [x] **Carrito y listado de pedidos**: pedidos de tipo local (`LOCAL`) o para llevar (`TAKEAWAY`) y listado de ordenes pendientes y finalizadas.
- [x] **Panel de insumos**: gestión de insumos (con subida de imágenes a Cloudinary), categorías y pedidos, con filtros por estado y rango de fechas.
- [x] **Tiempo real**: streams SSE para el estado del negocio (abierto/cerrado), actualizaciones de precios, nuevos pedidos e insumos disponibles.
- [x] **Autenticación**: login/registro con JWT + refresh token en cookies httpOnly y sesiones persistidas.
- [x] **Roles y suscripciones**: `USER`, `ADMIN` y planes de suscripción (`FREE_TRIAL`, `MONTHLY`, `SEMI_ANNUAL`, `ANNUAL`).

### Stack tecnológico

| Capa     | Tecnologías                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend | ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white) ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?logo=shadcnui&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-602C3C) ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white) ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-3E67B1) |
| Backend  | ![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white) ![Passport](https://img.shields.io/badge/Passport-34E27A?logo=passport&logoColor=white) ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white) ![Multer](https://img.shields.io/badge/Multer-000000) ![SSE](https://img.shields.io/badge/SSE-Server--Sent_Events-555555)            |
| Infra    | ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white) ![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm&logoColor=white)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Estructura del proyecto

```
ordering-system/
├─ backend/
│  ├─ prisma/
│  │  ├─ schema.prisma          # Modelo de datos
│  │  ├─ migrations/            # Migraciones SQL
│  │  └─ seed.ts                # Datos iniciales
│  └─ src/
│     ├─ cloudinary/            # Servicios de cloudinary.
│     ├─ common/                # Filtros, interceptores, decoradores
│     ├─ config/                # Configuración por entorno (@nestjs/config)
│     ├─ features/*				  # Módulos de dominios (auth, orders, supplies, etc)
│     └─ main.ts                # Bootstrap (prefix /api, CORS, filtros)
│
└─ frontend/
   └─ src/
      ├─ components/            # UI (shadcn/ui + componentes propios)
      ├─ hooks/                 # Data fetching (TanStack Query).
      ├─ interfaces/            # Interfaces y tipos del frontend
      ├─ lib/                   # Utilidades y configuraciones compartidas
      ├─ pages/                 # Vistas por ruta
      ├─ schemas/               # Esquemas zod para formularios.
      ├─ services/              # Funciones para peticiones a backend.
      ├─ skeletons/             # Estados de carga de componentes
      ├─ stores/                # Estado global (Zustand)
      └─ interfaces/            # Tipos compartidos con el API
```

### Requisitos previos

- **Node.js** >= 20
- **pnpm** >= 9
- **Docker** (solo para el Postgres local de respaldo) o una base **Supabase**

### Puesta en marcha

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

### 3. Base de datos

La conexión se define en `backend/.env` mediante `DATABASE_URL`.

**Opción A — Supabase (principal):** pega tu connection string (session pooler) en `DATABASE_URL`:

```
postgres://postgres.<project-ref>:<db-password>@aws-<region>.pooler.supabase.com:5432/postgres
```

**Opción B — PostgreSQL local con Docker (fallback):** levanta el contenedor y descomenta la `DATABASE_URL` local en `backend/.env`.

```bash
pnpm --filter backend docker:up
```

### 4. Generar cliente Prisma, aplicar migraciones y sembrar datos

```bash
pnpm --filter backend exec prisma generate
pnpm --filter backend exec prisma migrate deploy
pnpm --filter backend db:seed
```

> Con Supabase usa `prisma migrate deploy` (aplica las migraciones versionadas). Con Docker local también funciona `prisma migrate dev` para crear una migración nueva durante el desarrollo.

### 5. Iniciar en modo desarrollo

```bash
pnpm --filter backend start:dev     # API en http://localhost:3003/api
pnpm --filter frontend dev          # Frontend en http://localhost:5173
```

### Scripts

#### Raíz

| Comando             | Descripción                    |
| ------------------- | ------------------------------ |
| `pnpm back:lint`    | Lint del backend.              |
| `pnpm front:lint`   | Lint del frontend.             |
| `pnpm format:check` | Verifica formato con Prettier. |
| `pnpm format:fix`   | Corrige formato con Prettier.  |

### Calidad

- **Lint**: ESLint en `backend/` y `frontend/` (sin variables sin usar en backend).
- **Formato**: Prettier (comillas simples, punto y coma, sangría de 2 espacios).
- **Hooks de Git**: husky + lint-staged (ESLint fix + Prettier en `*.{ts,js,tsx,jsx}`) y commitlint con Conventional Commits.
- **Tests**: Jest unitarios en `backend/src` y end-to-end en `backend/test`.

## Autor

Juan Ramirez
