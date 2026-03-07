#!/bin/bash
# Script para subir el proyecto desde tu computadora local con GitHub Desktop

echo "🇦🇷 SIMULADOR ARGENTINA 2001 - Setup Local"
echo "=========================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "README.md" ]; then
    echo "❌ Error: Ejecutá este script desde el directorio SimuladorArgentinaGame/"
    exit 1
fi

echo "✅ Inicializando repositorio Git..."
git init

echo "✅ Agregando archivos..."
git add .

echo "✅ Creando commit inicial..."
git commit -m "🇦🇷 Implementación completa del Simulador Argentina 2001

- Sistema de juego completo con motor económico
- Variables temáticas del 2001 (PBI, reservas, inflación, etc)
- 10 decisiones políticas con humor argentino
- 12 eventos random inspirados en la crisis
- Sistema de guardado de datos a CSV
- Notebook de análisis con pandas y matplotlib
- Visualizaciones de evolución económica
- Detección de crisis y análisis de impacto
- README completo con contexto histórico"

echo "✅ Configurando remote..."
git remote add origin https://github.com/Joaquinagm01/SimuladorArgentinaGame.git
git branch -M main

echo ""
echo "🎉 ¡Listo! Ahora:"
echo "   1. Abrí GitHub Desktop"
echo "   2. File → Add Local Repository"
echo "   3. Seleccioná esta carpeta"
echo "   4. Clic en 'Push origin' o 'Publish repository'"
echo ""
echo "O desde la terminal:"
echo "   git push -u origin main"
echo ""
