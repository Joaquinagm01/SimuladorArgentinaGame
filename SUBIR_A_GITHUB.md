# 📤 Cómo Subir el Proyecto a GitHub

Ya tenés todo el código listo localmente con el commit hecho. Acá están las opciones más fáciles:

---

## ✅ OPCIÓN 1: Usar VS Code (MÁS FÁCIL)

VS Code tiene integración con GitHub incorporada:

1. **Abrir el Control de Código Fuente**
   - Presioná `Ctrl+Shift+G` (o `Cmd+Shift+G` en Mac)
   - O clic en el ícono de "Source Control" en la barra lateral izquierda

2. **Push**
   - Verás el commit listo: "🇦🇷 Implementación completa del Simulador Argentina 2001"
   - Clic en los tres puntos `...` arriba
   - Selecciona `Push` o `Push to...`
   - Puede pedirte autenticación, seguí las instrucciones

---

## ✅ OPCIÓN 2: Clonar en tu Máquina Local (CON GITHUB DESKTOP)

### Paso 1: Descargar el proyecto desde Codespaces

En Codespaces, ejecutá:

```bash
cd /workspaces
tar -czf SimuladorArgentinaGame.tar.gz SimuladorArgentinaGame/
```

Luego descarga el archivo `.tar.gz` desde VS Code.

### Paso 2: En tu computadora local

1. Extraer el archivo
2. Abrir **GitHub Desktop**
3. `File` → `Add Local Repository` → Selecciona la carpeta
4. GitHub Desktop detectará que es un repo
5. Clic en `Publish repository` o `Push origin`

---

## ✅ OPCIÓN 3: Desde la Terminal (SI TENÉS PERMISOS)

Si ya tenés GitHub Desktop en tu máquina local:

1. Clona el repo vacío:
   ```bash
   git clone https://github.com/Joaquinagm01/SimuladorArgentinaGame.git
   ```

2. Copia estos archivos al repo clonado:
   - `/game/` (todo el directorio)
   - `/analysis/` (todo el directorio)
   - `/data/` (todo el directorio)
   - `README.md`
   - `.gitignore`

3. En GitHub Desktop:
   - Abre el repositorio
   - Verás todos los cambios en la pestaña "Changes"
   - Escribe un mensaje de commit
   - Clic en `Commit to main`
   - Clic en `Push origin`

---

## 📦 Contenido del Commit

**Commit**: `🇦🇷 Implementación completa del Simulador Argentina 2001`

**Archivos incluidos:**
- ✅ `game/main.py` - Motor del juego
- ✅ `game/economy.py` - Sistema económico
- ✅ `game/decisions.py` - 10 decisiones políticas
- ✅ `game/events.py` - 12 eventos random
- ✅ `analysis/analysis.ipynb` - Notebook de análisis completo
- ✅ `data/.gitkeep` - Directorio para datos
- ✅ `README.md` - Documentación épica
- ✅ `.gitignore` - Configuración de Git

**Total**: 8 archivos, 1315 líneas de código

---

## 🚀 Después de Subir

Una vez que lo subas a GitHub, vas a poder:

1. Ver el proyecto en: https://github.com/Joaquinagm01/SimuladorArgentinaGame
2. Agregar temas/topics: `python`, `data-analysis`, `game`, `economics`, `pandas`
3. Compartir el link en tu portfolio o LinkedIn
4. Seguir agregando features con commits nuevos

---

## 🆘 Problemas Comunes

**"Permission denied"**
- El GITHUB_TOKEN del Codespace no tiene permisos de escritura
- Solución: Usa GitHub Desktop desde tu máquina local

**"Repository not found"**
- Verifica que el repo existe en: https://github.com/Joaquinagm01/SimuladorArgentinaGame
- Si no existe, créalo primero desde GitHub.com

**"Nothing to commit"**
- Es normal si ya hiciste el commit
- Solo necesitás hacer `push`

---

¿Cuál opción vas a usar? 🚀
