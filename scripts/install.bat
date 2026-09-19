@echo off
setlocal enabledelayedexpansion

echo ================================================
echo   BoilerPlate Node.js - Instalador
echo ================================================
echo.

echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo   ERROR: Node.js no esta instalado.
    echo   Por favor instala Node.js desde https://nodejs.org
    exit /b 1
)
for /f "delims=" %%v in ('node --version') do set NODE_VERSION=%%v
echo   Node.js %NODE_VERSION% detectado.

echo.
echo [2/5] Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo   ERROR: npm no esta instalado.
    exit /b 1
)
for /f "delims=" %%v in ('npm --version') do set NPM_VERSION=%%v
echo   npm %NPM_VERSION% detectado.

echo.
echo [3/5] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo   ERROR: Fallo la instalacion de dependencias.
    exit /b 1
)
echo   Dependencias instaladas correctamente.

echo.
echo [4/5] Configurando archivos de entorno...
if not exist ".env" (
    copy ".env.example" ".env"
    echo   Archivo .env creado desde .env.example
) else (
    echo   Archivo .env ya existe, omitiendo...
)

echo.
echo [5/5] Verificando instalacion...
call npm run lint --silent 2>nul
if errorlevel 1 (
    echo   ADVERTENCIA: ESLint encontro errores menores.
)

echo.
echo ================================================
echo   Instalacion completada!
echo ================================================
echo.
echo   Comandos disponibles:
echo   - npm start    : Iniciar el servidor
echo   - npm run dev  : Iniciar en modo desarrollo
echo   - npm test     : Ejecutar tests
echo.
echo   Documentacion: ver README.md
echo ================================================

endlocal
