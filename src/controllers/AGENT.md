# Controllers - Capa de Controlador

## Responsabilidad
Esta capa es responsable de:
- Recibir y procesar requests HTTP
- Validar inputs del usuario
- Coordinar entre modelos y vistas
- Retornar respuestas HTTP apropiadas
- Manejar errores de manera consistente

## Reglas para AI Agents

### Naming Conventions
- Archivos: `PascalCaseController.js` (ej: `UserController.js`, `AuthController.js`)
- Métodos: `camelCase`
- Nombre del método debe coincidir con la acción: `getUsers`, `createUser`, `updateUser`

### Estructura de un Controller
```javascript
class EntityController {
  constructor(service) {
    this.entityService = service;
  }

  async getAll(req, res, next) {}
  async getById(req, res, next) {}
  async create(req, res, next) {}
  async update(req, res, next) {}
  async delete(req, res, next) {}
}
```

### Response Format
```javascript
{
  success: true,
  data: {},
  message: 'Operation successful',
  meta: { page: 1, total: 100 }
}
```

### Códigos de Estado HTTP
- 200: Success
- 201: Created
- 204: No Content (delete)
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### Manejo de Errores
- Usar `try/catch` con `next(error)`
- Delegar errores al middleware de errores
- Nunca enviar respuestas de error en el controller directamente
