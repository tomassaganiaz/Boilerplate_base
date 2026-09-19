# Views - Capa de Presentación

## Responsabilidad
Esta capa es responsable de:
- Definir las rutas de la API
- Renderizar respuestas para el cliente
- Manejar协商 (content negotiation)
- Formatear datos para diferentes tipos de cliente

## Reglas para AI Agents

### Naming Conventions
- Archivos: `PascalCaseRouter.js` (ej: `UserRouter.js`, `AuthRouter.js`)
- Métodos de ruta: HTTP verbs en minúsculas (get, post, put, delete)

### Estructura de un Router
```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/EntityController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
```

### Nested Routers
```javascript
router.use('/users/:userId/posts', postRouter);
```

### Query Parameters Comunes
- `page` - número de página
- `limit` - elementos por página
- `sort` - campo de ordenamiento
- `order` - asc/desc
- `filter` - filtros específicos

### Validación de Parámetros
- Usar middleware de validación
- Validar tipos y formatos
- Sanitizar inputs
