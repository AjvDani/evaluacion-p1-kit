# Evaluación P1 · API de reservas de canchas

API REST en Express + Prisma 7 + PostgreSQL para gestionar horarios y reservas de canchas, con autenticación JWT y autorización por rol/dueño.

## Requisitos

- Node.js 22+
- Docker Desktop
- npm

## Puesta en marcha

```bash
# 1. Variables de entorno (PORT=30XX con los dos últimos dígitos del ID ESPE)
cp .env-example .env

# 2. Dependencias
npm install

# 3. Base de datos PostgreSQL 17
docker compose up -d

# 4. Migraciones, cliente Prisma y datos iniciales
npx prisma migrate deploy
npx prisma generate
npx prisma db seed

# 5. Servidor en desarrollo (reinicio automático)
npm run dev
```

El servidor queda en `http://localhost:3077` (según `PORT` en `.env`). Para producción local: `npm start`.

### Datos del seed

| Rol | Email | Contraseña |
|---|---|---|
| ADMIN | `paulo.galarza@example.com` | `admin123` |
| USER | `jdvilla3@espe.edu.ec` | `user123` |

Horarios: `Pádel 3` (08:00–10:00) y `Ecuavóley 3` (10:00–12:00). Incluye 2 reservas de ejemplo.

## Endpoints

Todas las rutas cuelgan de `/api`. El token se envía como `Authorization: Bearer <token>`.

| Método | Ruta | Acceso | Body | Respuestas |
|---|---|---|---|---|
| POST | `/auth/register` | Público | `{ name, email, password }` | 201 `{ message }` · 400 campos faltantes, email inválido o duplicado |
| POST | `/auth/login` | Público | `{ email, password }` | 200 `{ token }` (JWT `{ id, role }`, 4 h) · 400 credenciales inválidas |
| GET | `/auth/protected-route` | Token | — | 200 · 401 sin token · 403 token inválido |
| POST | `/admin/schedules` | ADMIN | `{ court, startTime, endTime }` | 201 horario · 400 campos faltantes · 401 sin token · 403 no ADMIN |
| GET | `/admin/bookings` | ADMIN | — | 200 reservas con `user` y `schedule` · 401 · 403 |
| POST | `/bookings` | Token | `{ date, scheduleId }` | 201 reserva (`userId` del token) · 400 horario ocupado · 401 |
| GET | `/bookings/:id` | Dueño o ADMIN | — | 200 · 401 · 403 no es tu reserva · 404 no existe |
| PUT | `/bookings/:id` | Dueño o ADMIN | `{ date, scheduleId }` | 200 · 400 horario ocupado · 401 · 403 · 404 |
| DELETE | `/bookings/:id` | Dueño o ADMIN | — | 204 · 401 · 403 · 404 |
| GET | `/users/:id/bookings` | Dueño o ADMIN | — | 200 reservas del usuario con `schedule` · 401 · 403 si `:id` no es tuyo |

### Capas

- `routes/` define rutas y middlewares.
- `controllers/` valida la petición y arma la respuesta HTTP.
- `services/` contiene el acceso a datos con `PrismaClient` + `PrismaPg`.
- `middlewares/` incluye `authenticateToken`, `authorizeBooking` y `authorizeUser`.

## Postman

1. Importar el entorno `postman/EVAL_P1_local.postman_environment.json`.
2. Importar la colección `postman/EVAL_P1_Villa.postman_collection.json`.
3. Seleccionar el entorno `EVAL_P1_local` (su `baseUrl` es `http://localhost:3077`).
4. Ejecutar la colección completa con **Run collection**; las carpetas están en orden (`00` a `03`).

La colección obtiene los tokens de los logins, guarda los ids de horarios/reservas en variables de entorno y prueba cada endpoint con sus casos de éxito y error (201/200/204/400/401/403/404). El registro usa un email dinámico para poder repetir la ejecución.

Si se ejecuta varias veces, conviene restaurar los datos base con:

```bash
npx prisma db seed
```
