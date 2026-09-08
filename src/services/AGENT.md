# Services - Lógica de Negocio

## Responsabilidad
Esta capa es responsable de:
- Contener toda la lógica de negocio
- Separar la lógica de los controllers
- Reutilizar lógica entre controllers
- Mantener el código testeable
- Ser el puente entre controllers y models

## Reglas para AI Agents

### Naming Conventions
- Archivos: `PascalCaseService.js` (ej: `UserService.js`, `PaymentService.js`)
- Métodos: `camelCase`
- Usar suffix `Service` en el nombre de la clase

### Estructura de un Service
```javascript
class EntityService {
  constructor(model) {
    this.EntityModel = model;
  }

  async getAll(filters) {}
  async getById(id) {}
  async create(data) {}
  async update(id, data) {}
  async delete(id) {}
}
```

### Principios
- Un service debe tener una única responsabilidad
- No acceder directamente a `req` o `res`
- Lanzar errores con mensajes claros
- Usar transacciones para operaciones múltiples
- Cachear resultados costosos cuando sea necesario

### Inyección de Dependencias
```javascript
const userService = new UserService(UserModel, emailService);
```

### Transacciones
```javascript
async createUserWithProfile(userData, profileData) {
  return await this.transaction(async (trx) => {
    const user = await this.UserModel.create(userData, trx);
    const profile = await this.ProfileModel.create({ ...profileData, userId: user.id }, trx);
    return { user, profile };
  });
}
```

### Manejo de Errores
```javascript
class NotFoundError extends Error {
  constructor(entity, id) {
    super(`${entity} with id ${id} not found`);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}
```
