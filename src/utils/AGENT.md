# Utils - Utilidades y Helpers

## Responsabilidad
Esta capa es responsable de:
- Funciones helper reutilizables
- Constantes de la aplicación
- Formateadores y parsers
- Helpers para fechas, strings, etc.
- Funciones de validación genéricas

## Reglas para AI Agents

### Naming Conventions
- Archivos: `kebab-case.js` (ej: `date-helpers.js`, `string-helpers.js`)
- Funciones: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`

### Estructura
```javascript
// utils/date-helpers.js
const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  DISPLAY: 'DD/MM/YYYY',
  TIMESTAMP: 'x',
};

const formatDate = (date, format = DATE_FORMATS.ISO) => {
  // implementation
};

module.exports = {
  DATE_FORMATS,
  formatDate,
  // ...
};
```

### Utilidades Comunes
- `date-helpers.js` - Formateo de fechas
- `string-helpers.js` - Manipulación de strings
- `validation-helpers.js` - Validaciones genéricas
- `response-helpers.js` - Helpers de respuesta
- `error-helpers.js` - Constructores de errores

### Reglas
- Funciones puras (sin side effects)
- Funciones pequeñas y enfocadas
- Documentar JSDoc para funciones públicas
- No usar estado global
- Tests unitarios para cada utilidad
