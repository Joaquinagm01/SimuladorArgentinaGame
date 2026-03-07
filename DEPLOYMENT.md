# 🚀 Cómo deployar a Vercel

## Opción 1: Desde la web (MÁS FÁCIL)

1. Ingresá a https://vercel.com
2. Hacé login con tu cuenta de GitHub
3. Click en "New Project"
4. Importá el repositorio `SimuladorArgentinaGame`
5. Vercel detecta todo automáticamente (gracias a `vercel.json`)
6. Click en "Deploy"
7. ¡Listo! En 2 minutos tu juego está online 🎮

Tu juego estará en: `https://tu-proyecto.vercel.app`

## Opción 2: Desde la terminal

```bash
# Instalar Vercel CLI (solo la primera vez)
npm install -g vercel

# Deploy
./deploy.sh
```

O manualmente:

```bash
vercel login
vercel --prod
```

## 🔧 Configuración

Ya está todo configurado en `vercel.json`:
- ✅ Backend Python (API Flask)
- ✅ Frontend estático
- ✅ Rutas configuradas
- ✅ Variables de entorno

## 🎯 Después del deploy

1. Copiá la URL que te da Vercel
2. Actualizá `README_WEB.md` con tu link
3. ¡Compartí tu juego!

## 📱 Testing

Después de deployar, probá en:
- Chrome/Edge (desktop y móvil)
- Firefox
- Safari (iOS)

## 🐛 Si algo falla

1. Verificá que se haya compilado el Python:
   - En Vercel dashboard, andá a tu proyecto
   - Click en "Deployments"
   - Click en el deployment
   - Revisá los logs de build

2. Si la API no responde:
   - Verificá `api/index.py`
   - Asegurate que `requirements.txt` esté actualizado

3. Si el frontend no carga:
   - Revisá la consola del navegador (F12)
   - Verificá que las rutas en `vercel.json` estén bien

## 🔄 Actualizar el deploy

Cada vez que hagas push a GitHub, Vercel re-deploys automáticamente.

```bash
git add .
git commit -m "Mejoras"
./git-push.sh origin main
```

## 💡 Tips

- El primer deploy puede tardar 2-3 minutos
- Los siguientes son más rápidos
- Vercel te da una URL de preview por cada commit
- Podés configurar un dominio custom gratis

## 🆘 Ayuda

Si tenés problemas:
- https://vercel.com/docs
- https://vercel.com/support
