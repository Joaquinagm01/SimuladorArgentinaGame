# 🚀 INICIO RÁPIDO - Cyber Defense Simulator

## ⚡ Para Empezar en 10 Segundos

### 1. Abre el Juego
🌐 **[JUGAR AHORA](https://simulador-argentina-game.vercel.app/)**

### 2. Haz Click en "INITIALIZE SOC"
¡Y listo! El juego inicia.

> 💡 **Tip:** El juego está desplegado en Vercel - no necesitas instalar nada.

---

## 🎮 Primeros 3 Turnos (Para Principiantes)

### Turno 1: Familiarízate
1. Lee el tutorial que aparece en el Event Log (abajo)
2. Mira los paneles: amenazas, herramientas, equipo, métricas
3. Revisa el panel "GLOSSARY & HELP" para entender términos
4. **Acción:** Haz click en 🔍 **INVESTIGATE** → Selecciona "Analyze Alert Queue"

### Turno 2: Primera Respuesta
1. Mira cuántas alertas tienes ahora
2. Si aparecieron amenazas activas, es normal
3. **Acción:** Haz click en 🎯 **PROACTIVE** → Selecciona "Security Awareness Training"
   - Esto entrena a usuarios para reducir phishing futuro

### Turno 3: Mejora tu Equipo
1. Revisa tu presupuesto (debería estar ~$140k)
2. Si tienes >20 alertas, necesitas más analistas
3. **Acción:** Haz click en 👥 **TEAM** → Selecciona "Hire L2 Analyst"
   - Analistas L2 procesan 2 alertas por turno (mejor que L1)

---

## 📊 Panel de Control Explicado

```
┌─────────────────────────────────────────────────┐
│  Turn: 5 | Score: 72 | Budget: $135k | Rep: 63 │  ← Tu estado actual
└─────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬────────────────┐
│ 🚨 AMENAZAS      │ 💻 INFRA         │ 🛡️ HERRAMIENTAS│
├──────────────────┼──────────────────┼────────────────┤
│ Threats: 2       │ Score: 72/100    │ SIEM   🟢      │
│ Alerts: 15       │ Protected: 85%   │ EDR    🟢      │
│ Infected: 0      │ Budget: $135k    │ XDR    ⚫      │
│ Breaches: 0      │ Reputation: 63   │ IDS    🟢      │
│                  │                  │ IPS    ⚫      │
│                  │                  │ WAF    ⚫      │
│                  │                  │ DLP    ⚫      │
└──────────────────┴──────────────────┴────────────────┘

┌──────────────────┬──────────────────┬────────────────┐
│ 👥 EQUIPO SOC    │ 📈 MÉTRICAS      │ 🧠 GLOSARIO   │
├──────────────────┼──────────────────┼────────────────┤
│ L1: 4 (1/turno)  │ MTTD: 35 min     │ <scroll para   │
│ L2: 3 (2/turno)  │ MTTR: 90 min     │  ver términos> │
│ Hunters: 1 (3/t) │ Resolved: 3      │                │
│ Capacity: 13/t   │ Blocked: 8       │                │
└──────────────────┴──────────────────┴────────────────┘

[🔍 INVESTIGATE] [🚨 RESPOND] [🔧 UPGRADE] [👥 TEAM] [🎯 PROACTIVE]
                         ← Haz click aquí
```

---

## 💡 3 Reglas de Oro

### 1️⃣ Controla las Alertas
- Si Alertas > 30 → Contrata más analistas
- Si Alertas > 100 → **GAME OVER**
- Tu equipo procesa: (4 L1 × 1) + (3 L2 × 2) + (1 Hunter × 3) = **13 alertas/turno**

### 2️⃣ Mantén Security Score > 50
- Si baja mucho, usa acciones PROACTIVE
- Score = 0 → **GAME OVER**

### 3️⃣ No Te Quedes Sin Dinero
- Cada acción cuesta dinero
- Reserva $30k para emergencias
- Budget = 0 → **GAME OVER**

---

## 🆘 Problemas Comunes

### "No carga la página"
= Refresca el navegador (F5) o verifica tu conexión a internet

### "Tengo muchas alertas"
= Contrata más analistas (TEAM → Hire L2 Analyst)

### "Mi Security Score baja"
= Acciones proactivas (PROACTIVE → Security Awareness / Vulnerability Scan)

### "No entiendo los términos"
= Mira el panel "GLOSSARY & HELP" en el dashboard o lee TUTORIAL.md

---

## 📚 Recursos

- **Tutorial Completo:** [TUTORIAL.md](TUTORIAL.md) ← Lee esto si eres nuevo en ciberseguridad
- **Documentación Técnica:** [README_CYBER.md](README_CYBER.md)
- **Guía de Juego:** [PLAY.md](PLAY.md)

---

## 🎯 Meta para Primera Partida

**Objetivo Realista:**
- Sobrevivir 20+ turnos
- Security Score > 40
- < 3 breaches

**No te frustres si pierdes las primeras veces**. La ciberseguridad es compleja y requiere práctica. ¡Cada partida enseña algo nuevo!

---

## 🚀 ¡Buena Suerte!

Recuerda: **Prevenir es mejor que curar**. Las acciones PROACTIVE son tu mejor inversión.

¿Listo? → **[Juega ahora](https://simulador-argentina-game.vercel.app/)**

🛡️ ¡Defiende la red, Comandante!
