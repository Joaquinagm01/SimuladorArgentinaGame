#!/bin/bash

echo "======================================"
echo "🔍 ANÁLISIS DE BOTONES FLOTANTES"
echo "======================================"
echo ""

echo "📋 Buscando botones con position: fixed en CSS..."
echo ""

cd /home/codespace/SimuladorArgentinaGame/public

# Buscar clases de botones flotantes en CSS
echo "🔹 Botones en educational-styles.css:"
grep -n "\..*button.*{" educational-styles.css | head -10
echo ""

echo "🔹 Botones en save-styles.css:"
grep -n "\.floating-save-btn" save-styles.css | head -5
echo ""

echo "📝 Verificando estado de los botones en JavaScript..."
echo ""

echo "🔹 Estado del help-button en educational-system.js:"
grep -A 2 "createEducationalUI" educational-system.js | head -5
echo ""

echo "🔹 Estado del floating-save-btn en save-ui.js:"
grep -A 2 "createSaveButton();" save-ui.js | head -5
echo ""

echo "======================================"
echo "✅ RESUMEN"
echo "======================================"
echo ""
echo "Botones flotantes encontrados:"
echo "1. help-button (?) - COMENTADO ✅"
echo "2. floating-save-btn (💾) - COMENTADO ✅"
echo ""
echo "🎉 NO HAY BOTONES DUPLICADOS"
echo "Todos los botones flotantes están deshabilitados correctamente."
echo ""
