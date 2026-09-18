# Persistencia

- **Motor soportado:** Postgres 15+ (vía `pg`).
- **Cliente:** `src/config/database.ts` expone `getPool()`, `checkDbHealth()`, `disconnectDb()`. En `test` o sin driver usa store en memoria (`ExampleModel` Map).
- **Migraciones:** SQL en `src/db/migrations/*.sql`. Ejecutar con `npm run db:migrate` (usa `psql` o `node scripts/migrate.js`).
- **Seeds:** `src/db/seeds/001_examples.ts` idempotente.
- **Health:** `GET /api/v1/health`, `/ready` verifican DB.

```bash
# levantar postgres con docker-compose
docker-compose up -d db
npm run db:migrate
npm run db:seed
```
