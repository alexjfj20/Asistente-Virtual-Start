#!/bin/bash
# Script para iniciar el frontend
echo "🚀 Iniciando frontend de Asistente Virtual..."
echo ""
echo "📂 Directorio actual: $(pwd)"
echo "📋 Verificando dependencias..."

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json"
    echo "💡 Asegúrate de ejecutar este script desde el directorio asistente-virtual-start"
    exit 1
fi

npm install
echo ""
echo "🌐 Iniciando servidor de desarrollo..."
npm run dev
