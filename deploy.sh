#!/bin/bash

# Script de Deploy para Combinación Rúnica XAPI
# Uso: ./deploy.sh [servidor] [usuario] [directorio]

echo "🚀 Iniciando deploy de Combinación Rúnica XAPI..."

# Configuración por defecto
SERVER=${1:-"tu-servidor.com"}
USER=${2:-"tu-usuario"}
DIR=${3:-"/public_html/runa-xapi"}

echo "📡 Servidor: $SERVER"
echo "👤 Usuario: $USER"
echo "📁 Directorio: $DIR"

# Archivos principales para subir
FILES=(
    "index.html"
    "xapi-config.js"
    "xapi.js"
    "parent-system-demo.html"
    "README.md"
    "package.json"
    "FTP-DEPLOY.md"
)

echo "📦 Preparando archivos para subir..."

# Crear directorio temporal
mkdir -p deploy-temp
cd deploy-temp

# Copiar archivos
for file in "${FILES[@]}"; do
    if [ -f "../$file" ]; then
        cp "../$file" .
        echo "✅ Copiado: $file"
    else
        echo "❌ No encontrado: $file"
    fi
done

echo "📋 Archivos listos para deploy:"
ls -la

echo ""
echo "🔧 Comandos FTP sugeridos:"
echo "ftp $SERVER"
echo "user $USER"
echo "cd $DIR"
echo "binary"
echo "mput *"
echo "quit"

echo ""
echo "🌐 URLs de prueba después del deploy:"
echo "Juego principal: https://$SERVER/runa-xapi/index.html"
echo "Demo sistema padre: https://$SERVER/runa-xapi/parent-system-demo.html"
echo "Con parámetros XAPI: https://$SERVER/runa-xapi/index.html?xapi_endpoint=https://tu-lrs.com/xapi&xapi_user=usuario&xapi_pass=password"

echo ""
echo "✅ Deploy preparado. Ejecuta los comandos FTP manualmente o usa tu cliente FTP favorito."
echo "📁 Archivos en: ./deploy-temp/"
