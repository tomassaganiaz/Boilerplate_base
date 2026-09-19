# Models - Capa de Datos

## Responsabilidad
Esta capa es responsable de:
- Definir la estructura de datos de la aplicación
- Manejar la interacción con la base de datos
- Implementar validaciones a nivel de datos
- Gestionar relaciones entre entidades

## Reglas para AI Agents

### Naming Conventions
- Archivos: `PascalCase.js` (ej: `UserModel.js`, `ProductModel.js`)
- Clases: `PascalCase`
- Métodos: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`

### Estructura de un Model
```javascript
class EntityModel {
  constructor(data = {}) {
    this.id = data.id || null;
    // propiedades del modelo
  }

  static tableName = 'table_name';
  static primaryKey = 'id';

  static async findAll(filters = {}) {}
  static async findById(id) {}
  static async create(data) {}
  static async update(id, data) {}
  static async delete(id) {}
}
```

### Validaciones
- Usar Joi para validaciones de esquema
- Validar en el modelo antes de persistir
- Lanzar errores específicos con mensajes claros

### Patrones a Seguir
- Active Record pattern para modelos simples
- Repository pattern para operaciones complejas
- Data Transfer Objects (DTOs) para comunicación entre capas
