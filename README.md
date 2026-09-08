# BoilerPlate Node.js MVC

Boilerplate profesional para proyectos Node.js con arquitectura MVC.

## Estructura del Proyecto

```
├── src/
│   ├── app.js           # Configuración de la aplicación Express
│   ├── index.js         # Punto de entrada y arranque del servidor
│   ├── models/         # Capa de datos
│   ├── views/          # Capa de presentación (rutas)
│   ├── controllers/   # Capa de control
│   ├── services/       # Lógica de negocio
│   ├── middlewares/    # Middlewares Express
│   ├── config/         # Configuración
│   ├── utils/          # Utilidades
│   ├── routes/         # Rutas
│   └── agents/         # Documentación para IA
├── tests/
│   ├── unit/           # Tests unitarios
│   └── integration/   # Tests de integración
├── scripts/            # Scripts de automatización
└── docs/               # Documentación
```

## Requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

## Instalación

### Windows
```batch
scripts\install.bat
```

### Unix/Linux/Mac
```bash
chmod +x scripts/install.sh
./scripts/install.sh
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Iniciar el servidor |
| `npm run dev` | Iniciar en modo desarrollo (con hot-reload) |
| `npm test` | Ejecutar todos los tests |
| `npm run test:unit` | Ejecutar tests unitarios |
| `npm run test:integration` | Ejecutar tests de integración |
| `npm run lint` | Verificar código con ESLint |
| `npm run lint:fix` | Corregir errores de ESLint automáticamente |
| `npm run format` | Formatear código con Prettier |

## Capas MVC

### Models (`src/models/`)
Define la estructura de datos y la interacción con la base de datos.
- `BaseModel.js` - Clase base con métodos comunes
- `ExampleModel.js` - Ejemplo de modelo

### Views (`src/views/`)
Gestiona las rutas HTTP y la presentación.
- `exampleRoutes.js` - Ejemplo de rutas

### Controllers (`src/controllers/`)
Procesa las requests HTTP y coordina entre modelos y servicios.
- `BaseController.js` - Controlador base
- `ExampleController.js` - Ejemplo de controlador

## Documentación para IA

Cada capa tiene su propio archivo `AGENT.md` con:
- Responsabilidades de la capa
- Reglas de nomenclatura
- Patrones a seguir
- Ejemplos de código
- Prohibiciones

## API Endpoints

### Health Check
```
GET /api/v1/health
```

### Examples
```
GET    /api/v1/examples      - Listar todos
GET    /api/v1/examples/:id  - Obtener por ID
POST   /api/v1/examples      - Crear nuevo
PUT    /api/v1/examples/:id  - Actualizar
DELETE /api/v1/examples/:id  - Eliminar
```

## Variables de Entorno

Copiar `.env.example` como `.env` y completar los valores necesarios. `JWT_SECRET` es obligatorio; en producción debe tener al menos 32 caracteres. La aplicación también valida los valores de entorno al iniciar.

## Seguridad de Configuración

- No se usan secretos JWT ni contraseñas de base de datos conocidos por defecto en producción.
- La aplicación Express se exporta desde `src/app.js` sin abrir un puerto, lo que facilita los tests.
- `src/index.js` se encarga únicamente de iniciar el servidor y gestionar el apagado ordenado.

## Docker

```bash
# Construir imagen
docker build -t boilerplate-nodejs .

# Ejecutar contenedor
docker-compose up

# Ejecutar en background
docker-compose up -d
```

## Testing

```bash
# Todos los tests
npm test

# Tests unitarios
npm run test:unit

# Tests con watch
npm run test:watch

# Coverage report
npm test -- --coverage
```

## Licencia

MIT
