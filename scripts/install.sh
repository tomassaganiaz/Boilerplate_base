#!/bin/bash

echo "================================================"
echo "   BoilerPlate Node.js - Instalador"
echo "================================================"
echo ""

echo "[1/5] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "  ERROR: Node.js no esta instalado."
    echo "  Por favor instala Node.js desde https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "  Node.js $NODE_VERSION detectado."

echo ""
echo "[2/5] Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "  ERROR: npm no esta instalado."
    exit 1
fi
NPM_VERSION=$(npm --version)
echo "  npm $NPM_VERSION detectado."

echo ""
echo "[3/5] Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "  ERROR: Fallo la instalacion de dependencias."
    exit 1
fi
echo "  Dependencias instaladas correctamente."

echo ""
echo "[4/5] Configurando archivos de entorno..."
if [ ! -f ".env" ]; then
    cp ".env.example" ".env"
    echo "  Archivo .env creado desde .env.example"
else
    echo "  Archivo .env ya existe, omitiendo..."
fi

echo ""
echo "[5/5] Verificando instalacion..."
npm run lint --silent 2>/dev/null
if [ $? -ne 0 ]; then
    echo "  ADVERTENCIA: ESLint encontro errores menores."
fi

echo ""
echo "================================================"
echo "  Instalacion completada!"
echo "================================================"
echo ""
echo "  Comandos disponibles:"
echo "  - npm start    : Iniciar el servidor"
echo "  - npm run dev  : Iniciar en modo desarrollo"
echo "  - npm test     : Ejecutar tests"
echo ""
echo "  Documentacion: ver README.md"
echo "================================================"
