# Tests - Documentación de Testing

## Responsabilidad
Esta capa es responsable de:
- Tests unitarios (unit/)
- Tests de integración (integration/)
- Fixtures y mocks
- Configuración de Jest

## Reglas para AI Agents

### Estructura de Tests
```
tests/
├── unit/
│   ├── models/
│   ├── services/
│   ├── controllers/
│   └── utils/
├── integration/
│   └── routes/
├── fixtures/
├── mocks/
└── setup.js
```

### Naming Tests
```javascript
describe('EntityService', () => {
  describe('getById', () => {
    it('should return entity when exists', async () => {});
    it('should throw NotFoundError when not exists', async () => {});
  });
});
```

### Patrones de Test
```javascript
describe('UserService', () => {
  let userService;
  let mockUserModel;

  beforeEach(() => {
    mockUserModel = {
      findById: jest.fn(),
      create: jest.fn(),
    };
    userService = new UserService(mockUserModel);
  });

  it('should call model.findById with correct id', async () => {
    await userService.getById(1);
    expect(mockUserModel.findById).toHaveBeenCalledWith(1);
  });
});
```

### AAA Pattern
- **Arrange**: Setup del test
- **Act**: Ejecutar la acción
- **Assert**: Verificar el resultado

###覆盖率 Objetivos
- Unit tests: 80%+
- Integration tests: Cubrir endpoints críticos
