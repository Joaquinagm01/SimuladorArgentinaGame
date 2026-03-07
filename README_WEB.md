# 🎮 Simulador Argentina 2001 - Versión Web

Juego web retro estilo pixel art donde administrás Argentina durante la crisis del 2001.

**¡Jugá desde cualquier dispositivo!** PC, tablet o celular.

## 🚀 Demo Online

**Deployado en Vercel:** [Ver demo](https://tu-proyecto.vercel.app) ← (actualizar después del deploy)

## ✨ Features

- 🎨 **Estilo retro pixel art** - Como los juegos clásicos de los 80-90s
- 📱 **Responsive** - Funciona perfecto en PC, tablet y móvil
- 🎮 **Gameplay simple** - Fácil de jugar, difícil de dominar
- 📊 **Stats en tiempo real** - Seguí la economía argentina
- 🎲 **Eventos random** - Cada partida es diferente
- 💾 **Backend Python** - API Flask con la lógica del juego

## 🛠️ Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript vanilla
- **Backend:** Python (Flask)
- **Hosting:** Vercel Serverless Functions
- **Estilo:** Pixel art / Retro gaming

## 🎯 Cómo Jugar

1. Presioná **START**
2. Tu objetivo: **sobrevivir** lo máximo posible
3. Cada turno elegís una **decisión política**
4. Ocurren **eventos random**
5. Observá cómo afectan a:
   - 💰 Deuda externa
   - 📉 Desempleo
   - 🔥 Inflación
   - 😡 Descontento social
6. Si las **reservas llegan a 0**, el **desempleo supera 30%** o la **deuda supera 200%** → **GAME OVER**

## 🖥️ Desarrollo Local

### Opción 1: Servidor de desarrollo rápido

```bash
# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor de desarrollo
python -m http.server 8000 &
cd api && python index.py
```

Luego abrí:
- Frontend: http://localhost:8000/public/
- API: http://localhost:5000

### Opción 2: Con Vercel CLI (recomendado)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desarrollo local
vercel dev
```

Vercel levantará todo automáticamente en http://localhost:3000

## 📦 Deploy a Vercel

### Método 1: Desde GitHub (más fácil)

1. Pusheá el código a GitHub
2. Ingresá a [vercel.com](https://vercel.com)
3. Click en "New Project"
4. Importá tu repositorio
5. ¡Deploy automático! 🚀

### Método 2: Desde CLI

```bash
# Login
vercel login

# Deploy
vercel --prod
```

## 📁 Estructura del Proyecto

```
SimuladorArgentinaGame/
├── api/
│   └── index.py          # API Flask (serverless function)
├── public/
│   ├── index.html        # Frontend
│   ├── style.css         # Estilos retro
│   └── game.js           # Lógica del cliente
├── game/
│   ├── economy.py        # Motor económico
│   ├── decisions.py      # Decisiones políticas
│   └── events.py         # Eventos random
├── vercel.json           # Configuración de Vercel
├── requirements.txt      # Dependencias Python
└── README_WEB.md         # Este archivo
```

## 🎨 Personalización

### Cambiar colores retro

Editá las variables CSS en `public/style.css`:

```css
:root {
    --retro-bg: #0f0f23;           /* Fondo
    --retro-primary: #00ff41;      /* Verde neón
    --retro-secondary: #ff00ff;    /* Magenta
    --retro-danger: #ff0040;       /* Rojo
}
```

### Agregar más decisiones

Editá `game/decisions.py` y agregá nuevas decisiones con:

```python
{
    'title': "Tu Decisión",
    'description': "Descripción...",
    'effects': {
        'deuda': 5,
        'pbi': -2,
        ...
    }
}
```

### Agregar más eventos

Editá `game/events.py` y agregá nuevos eventos random.

## 🐛 Troubleshooting

### Error 404 en la API

- Asegurate de que `vercel.json` esté configurado correctamente
- Verificá que las rutas en `game.js` apunten a `/api`

### La página no carga

- Revisá la consola del navegador (F12)
- Verificá que el backend esté corriendo

### Error de CORS

- Ya está configurado `flask-cors`
- Si persiste, revisá el origen en `api/index.py`

## 📱 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (iOS y macOS)
- ✅ Móviles Android e iOS

## 🏆 High Score

¿Cuántos turnos podés sobrevivir? ¡Compartí tu récord!

## 📝 Licencia

MIT

## 🤝 Contribuciones

Pull requests son bienvenidos. Para cambios grandes, abrí primero un issue.

---

**¿Te gustó el juego?** ⭐ Dale una estrella al repo!

Made with 💚 in Argentina 🇦🇷
