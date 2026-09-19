# Scripts - Scripts de Automatización

## Responsabilidad
Esta carpeta contiene:
- Script de instalación
- Scripts de deployment
- Scripts de setup de base de datos
- Scripts de utilidad

## Reglas para AI Agents

### Script de Instalación
- Debe ser ejecutable en Windows (.bat) y Unix (.sh)
- Verificar requisitos previos (Node.js, npm)
- Instalar dependencias
- Crear archivos .env desde .env.example
- Inicializar git hooks con Husky

### Estructura
```
scripts/
├── install.bat      # Windows installer
├── install.sh       # Unix installer
├── setup-db.sh      # Database setup
└── deploy.sh        # Deployment script
```

### Script install.bat
```batch
@echo off
echo Installing BoilerPlate...

REM Verificar Node.js
node --version
if errorlevel 1 (
    echo Node.js is required but not installed.
    exit /b 1
)

REM Instalar dependencias
call npm install

REM Copiar .env
if not exist .env (
    copy .env.example .env
    echo .env created from .env.example
)

echo Installation complete!
```
