# Middlewares

## Responsabilidad
Esta capa es responsable de:
- Procesar requests antes de que lleguen al controller
- Autenticación y autorización
- Validación de datos
- Logging y monitoreo
- Manejo de errores
- Rate limiting

## Reglas para AI Agents

### Tipos de Middleware
1. **Application-level**: `app.use(middleware)`
2. **Router-level**: `router.use(middleware)`
3. **Error-handling**: `app.use((err, req, res, next) => {})`
4. **Built-in**: `express.json()`, `express.static()`

### Estructura de Middleware
```javascript
const middlewareName = (options = {}) => {
  return (req, res, next) => {
    // Lógica
    if (error) {
      return next(new CustomError('message', 400));
    }
    next();
  };
};
```

### Error Handling Middleware
```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
```

### Middlewares Comunes
- `auth.js` - Autenticación JWT
- `validator.js` - Validación de inputs
- `rateLimiter.js` - Rate limiting
- `logger.js` - Logging de requests
- `errorHandler.js` - Manejo global de errores
- `cors.js` - Configuración CORS

### Reglas
- Siempre llamar `next()` o enviar respuesta
- No capturar errores silenciosamente
- Mantener middlewares idempotentes
- Usar middleware de error al final
