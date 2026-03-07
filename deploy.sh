#!/bin/bash
# Script para deployar a Vercel

echo "🇦🇷 Deploying Simulador Argentina 2001 to Vercel..."
echo ""

# Verificar que Vercel CLI esté instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado"
    echo "Instalalo con: npm install -g vercel"
    exit 1
fi

# Login (si no está logueado)
echo "✅ Verificando autenticación..."
vercel whoami || vercel login

# Deploy
echo ""
echo "🚀 Deploying..."
vercel --prod

echo ""
echo "🎉 ¡Deploy completo!"
echo "Tu juego está ahora online y accesible desde cualquier dispositivo"
