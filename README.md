# BoilerPlate Node.js MVC

Boilerplate profesional para proyectos Node.js con arquitectura MVC.

## Estructura del Proyecto

```
├── src/
│   ├── app.ts           # App Express (sin side-effects)
│   ├── server.ts        # startServer() + gracefulShutdown
│   ├── index.ts         # Entrada que arranca el servidor
│   ├── config/          # Configuración + Joi + database.ts
│   ├── db/migrations/   # SQL migraciones
│   ├── middlewares/     # requestId, metrics, auth, validator...
│   ├── models/          # Capa de datos (TS)
│   ├── controllers/     # Capa de control (TS)
│   ├── services/        # Lógica de negocio + AuthService
│   ├── routes/          # Rutas + authRoutes
│   ├── types/           # Interfaces SOLID
│   └── utils/           # Helpers tipados
├── tests/
├── docs/openapi.yaml    # Spec OpenAPI 3.0
└── .github/workflows/ci.yml
```

## Requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

## Instalación

### Windows
```batch
scripts\install.bat
```

### Unix/Linux/Mac
```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run build` | Compilar TS a `dist/` |
| `npm start` | Iniciar servidor compilado |
| `npm run dev` | `ts-node-dev` con hot-reload |
| `npm test` | Tests con cobertura (umbral 80%) |
| `npm run test:unit` | Solo unit tests |
| `npm run test:integration` | Solo integración |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` | Prettier |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:migrate` | Ejecuta migraciones SQL |
| `npm run db:seed` | Seeds idempotentes |
| `npm run audit` | `npm audit` moderado |

## Capas MVC

### Models (`src/models/`)
Define la estructura de datos y la interacción con la base de datos.
- `BaseModel.js` - Clase base con métodos comunes
- `ExampleModel.js` - Ejemplo de modelo

### Views (`src/views/`)
Gestiona las rutas HTTP y la presentación.
- `exampleRoutes.js` - Ejemplo de rutas

### Controllers (`src/controllers/`)
Procesa las requests HTTP y coordina entre modelos y servicios.
- `BaseController.js` - Controlador base
- `ExampleController.js` - Ejemplo de controlador

## Documentación para IA

Cada capa tiene su propio archivo `AGENT.md` con:
- Responsabilidades de la capa
- Reglas de nomenclatura
- Patrones a seguir
- Ejemplos de código
- Prohibiciones

## API Endpoints

### Observabilidad
```
GET /api/v1/health   - estado + DB
GET /api/v1/live     - liveness
GET /api/v1/ready    - readiness (503 si DB down)
GET /api/v1/metrics  - totalRequests, avgLatency, uptime
```

### Auth (refresh token flow)
```
POST /api/v1/auth/login   {email,password} -> {accessToken (15m), refreshToken (7d)}
POST /api/v1/auth/refresh {refreshToken} -> {accessToken}
POST /api/v1/auth/logout  {refreshToken}
```

### Examples (paginación, validación Joi, 204 en delete)
```
GET    /api/v1/examples?page=1&limit=20&status=active
GET    /api/v1/examples/:id
POST   /api/v1/examples      (Bearer admin/user)
PUT    /api/v1/examples/:id  (Bearer admin)
DELETE /api/v1/examples/:id  (Bearer admin)
```
Docs OpenAPI: `docs/openapi.yaml`

## Variables de Entorno

Copiar `.env.example` → `.env`. En producción `JWT_SECRET` y `JWT_REFRESH_SECRET` ≥32 chars y `DB_PASSWORD` requerido (validación Joi falla si falta).

| Var | Descripción |
|-----|-------------|
| `CORS_ORIGIN` | `*` o lista `https://a.com,https://b.com` |
| `JWT_EXPIRES_IN` | `15m` (access corta) |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |

## Seguridad

- `helmet`, `cors` por whitelist, `compression`, `express-rate-limit` (global + `authLimiter` 5 req/15m para login).
- `requestId` (`X-Request-Id`) en logs (`method ruta status - duration [id]`).
- Secrets sin defaults inseguros en prod, payload limitado por `BODY_LIMIT`.

## Persistencia

`src/config/database.ts` usa `pg` si está disponible, sino memoria (tests). Migraciones en `src/db/migrations/*.sql`, seeds idempotentes. `docker-compose` levanta Postgres con healthcheck y límites de recursos.

## Docker

```bash
# Construir imagen multi-stage (non-root, HEALTHCHECK)
docker build -t boilerplate-nodejs .

# Ejecutar con Postgres + healthcheck + límites
docker-compose up -d

# Logs y puertos
docker-compose logs -f app
docker ps

# Rollback a versión anterior
docker-compose down
git checkout <tag-anterior>  # ej v1.1.0
docker-compose up --build -d
# o revert: git revert <commit> && git push
```

Variables: `PORT`, `DB_*`, `JWT_*`, `CORS_ORIGIN`, `LOG_LEVEL`. Ver `docs/COMMIT_CONVENTIONS.md` para versionado SemVer.

## Testing

```bash
# Todos los tests
npm test

# Tests unitarios
npm run test:unit

# Tests con watch
npm run test:watch

# Coverage report
npm test -- --coverage
```

## Licencia

MIT
