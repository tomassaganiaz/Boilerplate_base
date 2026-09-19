# Routes - Enrutamiento

## Responsabilidad
Esta capa es responsable de:
- Definir todas las rutas de la aplicación
- Organizar rutas por módulo/feature
- Aplicar middlewares específicos a rutas
- Versionar la API

## Reglas para AI Agents

### Estructura de Routes
```javascript
// routes/index.js
const express = require('express');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
```

### API Versioning
```javascript
// routes/v1/index.js
const express = require('express');
const router = express.Router({ mergeParams: true });

router.use('/users', userRoutes);

module.exports = router;
```

### Nested Resources
```javascript
// /users/:userId/posts
router.route('/users/:userId/posts')
  .get(postController.getByUser)
  .post(postController.create);
```

### Middleware en Rutas
```javascript
router.get('/protected', authMiddleware, controller.method);
router.post('/admin', [authMiddleware, adminMiddleware], controller.method);
```

### Orden de Rutas
1. Rutas estáticas (/:id)
2. Rutas con parámetros
3. Rutas catch-all
