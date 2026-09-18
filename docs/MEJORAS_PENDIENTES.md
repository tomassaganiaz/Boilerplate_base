# Posibles mejoras

Este documento reúne mejoras sugeridas para evolucionar el boilerplate Node.js MVC. Las tareas están ordenadas por prioridad y pueden convertirse en issues independientes.

## Estado actual (2026-09-18)

- [x] Validación centralizada de variables de entorno (Joi, `src/config/index.ts:8`).
- [x] Eliminación de secretos por defecto en producción (`JWT_SECRET`/`JWT_REFRESH_SECRET` ≥32, `DB_PASSWORD` requerido).
- [x] Separación app vs servidor (`src/app.ts` exporta app, `src/server.ts:startServer()` + `gracefulShutdown`).
- [x] Límite configurable de body (`BODY_LIMIT`, `config.http.bodyLimit`).
- [x] Migración completa JS → TS con SOLID (interfaces `IRepository/IService` en `src/types/index.ts:6`, DI por constructor).
- [x] Persistencia DB documentada (`src/config/database.ts`, `src/db/migrations/001_create_examples.sql`, `docker-compose` con Postgres + healthcheck).
- [x] Auth con refresh token (`src/services/AuthService.ts`, `src/routes/authRoutes.ts`, access 15m / refresh 7d, revocación en memoria).
- [x] Validación Joi por endpoint + respuestas uniformes (`src/middlewares/validator.ts:7`, `src/utils/response-helpers.ts:1`).
- [x] Observabilidad: `requestId` (`src/middlewares/requestId.ts:1`), logs con `X-Request-Id`, métricas (`src/middlewares/metrics.ts:1`), endpoints `/health`/`/live`/`/ready`/`/metrics`.
- [x] Seguridad HTTP: CORS whitelist (`CORS_ORIGIN`), `helmet`, `authLimiter` en login, `npm audit`.
- [x] Testing + CI: `jest.config.js:6` coverage 80%, ` .github/workflows/ci.yml`, tests de auth y observabilidad.
- [x] DX: `husky` + `lint-staged` en `package.json:50`, plantillas PR/Issue.
- [x] Docker multi-stage, usuario no root, `HEALTHCHECK` (`Dockerfile:1`), límites recursos en `docker-compose.yml`.
- [x] API versionada `/api/v1`, OpenAPI `docs/openapi.yaml`, paginación/filtros/ordenamiento.

## Prioridad alta

### 1. Endurecer la configuración de producción

- Eliminar los valores por defecto inseguros de `JWT_SECRET` y `DB_PASSWORD`.
- Validar las variables de entorno al iniciar la aplicación mediante un esquema Joi.
- Fallar con un mensaje claro cuando falte una variable obligatoria en producción.
- Separar la configuración por entorno y añadir un `.env.example` completo.

**Criterio de aceptación:** la aplicación no inicia en producción con secretos por defecto o variables críticas ausentes.

### 2. Separar la creación de la app del inicio del servidor

- Mover `app.listen()` a una función `startServer()` o a un archivo de arranque independiente.
- Exportar únicamente la instancia de Express desde el módulo de aplicación.
- Permitir que Jest importe la aplicación sin abrir un puerto.
- Añadir una prueba de apagado ordenado y manejo de errores de arranque.

**Criterio de aceptación:** los tests pueden importar la app sin efectos secundarios y el servidor cierra conexiones antes de terminar el proceso.

### 3. Completar la persistencia de datos

- Elegir y documentar el motor de base de datos soportado.
- Añadir un cliente de base de datos, migraciones y seeds reproducibles.
- Implementar conexión, desconexión y health check de la base de datos.
- Evitar que los modelos de ejemplo oculten si usan datos en memoria o persistentes.

**Criterio de aceptación:** un entorno nuevo puede levantar la base de datos y ejecutar migraciones con un comando documentado.

### 4. Mejorar autenticación y autorización

- Definir claramente el flujo de login, refresh token y revocación de sesiones.
- Usar expiraciones cortas para access tokens y almacenar refresh tokens de forma segura.
- Añadir tests para token ausente, inválido, expirado y permisos insuficientes.
- Aplicar una política explícita de roles y permisos por endpoint.

**Criterio de aceptación:** cada endpoint protegido tiene cobertura de autenticación y autorización, incluidos los casos negativos.

## Prioridad media

### 5. Estandarizar validación y respuestas HTTP

- Validar parámetros de ruta, query string y body con esquemas Joi por endpoint.
- Rechazar propiedades desconocidas cuando el contrato de la API lo requiera.
- Uniformar respuestas de éxito, paginación, errores y eliminación `204`.
- Publicar ejemplos de request y response para cada endpoint.

**Criterio de aceptación:** los endpoints devuelven códigos y estructuras consistentes ante entradas válidas e inválidas.

### 6. Añadir observabilidad

- Incorporar un `requestId` o `correlationId` en cada solicitud.
- Incluir método, ruta, estado, duración y request ID en los logs.
- Añadir métricas básicas: latencia, errores, rate limiting y uso de recursos.
- Crear endpoints separados para liveness y readiness.

**Criterio de aceptación:** una solicitud puede rastrearse desde el log de entrada hasta el error o respuesta final.

### 7. Reforzar seguridad HTTP

- Configurar CORS mediante una lista de orígenes permitidos, en lugar de permitirlos por defecto.
- Limitar el tamaño de payload según cada endpoint.
- Añadir protección contra abuso específica para login y operaciones costosas.
- Revisar dependencias con `npm audit` y automatizar actualizaciones controladas.

**Criterio de aceptación:** las políticas de CORS, payload y rate limiting están documentadas y cubiertas por tests.

### 8. Ampliar la estrategia de testing

- Subir progresivamente la cobertura de unit tests al objetivo documentado del 80%.
- Añadir tests de controladores, middlewares y errores globales.
- Crear fixtures y mocks reutilizables.
- Ejecutar tests, lint y formato en CI para cada pull request.
- Añadir tests de contrato o smoke tests para los endpoints críticos.

**Criterio de aceptación:** el pipeline bloquea cambios que rompan tests, lint o el umbral mínimo de cobertura.

## Prioridad baja

### 9. Mejorar la experiencia de desarrollo

- Añadir comandos para `lint`, `format`, `test`, cobertura y migraciones en la documentación.
- Incorporar hooks de `husky` y `lint-staged` realmente configurados.
- Añadir una plantilla de issue y una plantilla de pull request.
- Documentar convenciones de commits y versionado.

### 10. Preparar el despliegue

- Añadir un usuario no root en el `Dockerfile`.
- Usar una imagen multi-stage y fijar versiones base reproducibles.
- Añadir `HEALTHCHECK` y límites de recursos en Docker Compose.
- Documentar variables, puertos, logs y estrategia de rollback.

### 11. Mejorar la API pública

- Añadir versionado y política de compatibilidad.
- Generar documentación OpenAPI/Swagger.
- Definir paginación, filtros, ordenamiento y formato de fechas.
- Añadir soporte opcional para respuestas comprimidas y caché HTTP.

## Orden recomendado de implementación

1. Validación de configuración y eliminación de secretos por defecto.
2. Separación entre aplicación y servidor.
3. Persistencia, migraciones y health checks.
4. Autenticación, autorización y validación por endpoint.
5. Tests, CI y cobertura.
6. Observabilidad y endurecimiento de seguridad.
7. Docker y documentación OpenAPI.

## Definición de terminado

Una mejora se considera terminada cuando:

- Está implementada siguiendo las convenciones de la capa correspondiente.
- Tiene tests adecuados para el riesgo que introduce.
- Está documentada en el `README.md` o en la documentación específica.
- No introduce errores de lint ni reduce la cobertura acordada.
- Puede ejecutarse de forma reproducible en desarrollo y CI.
