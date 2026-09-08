# Config - Configuración de la Aplicación

## Responsabilidad
Esta capa es responsable de:
- Cargar y validar variables de entorno
- Proveer configuración centralizada
- Manejar diferentes entornos (dev, test, prod)
- Definir constantes de la aplicación

## Reglas para AI Agents

### Estructura de Config
```javascript
// config/index.js
require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  log: {
    level: process.env.LOG_LEVEL || 'info',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
};

module.exports = Object.freeze(config);
```

### Principios
- Nunca hardcodear valores sensibles
- Usar `Object.freeze()` para evitar mutación
- Validar variables requeridas al iniciar
- Provee defaults sensatos

### Archivos de Config
- `index.js` - Configuración principal
- `database.js` - Config de base de datos
- `logger.js` - Config de logging
- `env.js` - Validación de env vars
