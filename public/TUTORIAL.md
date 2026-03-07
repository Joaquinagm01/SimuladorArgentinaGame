# 📚 CYBER DEFENSE SIMULATOR - Tutorial Completo

## 🎮 ¿Qué es este juego?

Este es un **simulador educativo** donde aprendes sobre ciberseguridad operando un **SOC (Security Operations Center)** - Centro de Operaciones de Seguridad.

Tu misión: **Defender una organización de ataques cibernéticos reales durante 30 días** mientras gestionas recursos, equipo y herramientas de seguridad.

---

## 🎯 Objetivo del Juego

**GANAR:** Sobrevivir 30 turnos manteniendo:
- Security Score > 20
- Alertas < 100
- Presupuesto > 0

**PERDER:** Si cualquiera de estos límites se rompe, ¡Game Over!

---

## 🚀 Cómo Jugar

### 1️⃣ Inicio del Juego

Al iniciar, tendrás:
- 💰 **$150,000** de presupuesto
- 🛡️ **75/100** de Security Score
- 👥 **8 analistas** (4 L1, 3 L2, 1 Hunter)
- 🔧 **3 herramientas** activas (SIEM, EDR, IDS)

### 2️⃣ Dashboard Principal

El dashboard muestra toda la información clave:

#### Panel "THREAT STATUS" (Amenazas)
- **Active Threats:** Amenazas actualmente atacando tu red
- **Alerts Queue:** Alertas pendientes de revisar
- **Servers Infected:** Servidores comprometidos
- **Breaches:** Violaciones de datos exitosas

#### Panel "INFRASTRUCTURE"
- **Security Score:** Tu calificación general (0-100)
- **Endpoints Protected:** % de computadoras protegidas
- **Budget:** Dinero disponible
- **Reputation:** Imagen pública de la organización

#### Panel "SECURITY TOOLS" (Herramientas)
- 🟢 Verde = Activa | ⚫ Apagada
- **SIEM:** Recolecta y correlaciona logs
- **EDR:** Protección avanzada de endpoints
- **XDR:** EDR + Red + Cloud (más potente)
- **IDS:** Detecta intrusiones
- **IPS:** Previene intrusiones automáticamente
- **WAF:** Protege aplicaciones web
- **DLP:** Previene fuga de datos

#### Panel "SOC TEAM" (Tu Equipo)
- **L1 Analyst:** Monitorea alertas básicas (1 alerta/turno)
- **L2 Analyst:** Investiga incidentes complejos (2 alertas/turno)
- **Threat Hunter:** Busca amenazas avanzadas (3 alertas/turno)

#### Panel "RESPONSE METRICS"
- **MTTD:** Mean Time To Detect (tiempo de detección)
- **MTTR:** Mean Time To Respond (tiempo de respuesta)
- **Incidents Resolved:** Casos cerrados exitosamente
- **Attacks Blocked:** Ataques bloqueados

### 3️⃣ Los 5 Botones de Acción

Cada turno puedes elegir **UNA** acción de 5 categorías:

#### 🔍 INVESTIGATE (Investigar)
Analiza alertas y busca amenazas ocultas
- "Analyze Alert Queue" → Procesa alertas pendientes
- "Deep Dive" → Investigación profunda de incidentes
- "Hunt for APT" → Busca atacantes avanzados

#### 🚨 RESPOND (Responder)
Reacciona a incidentes activos
- "Isolate Infected Systems" → Desconecta servidores comprometidos
- "Deploy Patches" → Aplica parches de seguridad
- "Incident Response" → Respuesta completa a incidente crítico

#### 🔧 UPGRADE (Mejorar)
Compra e implementa herramientas
- "Deploy XDR" → EDR mejorado ($15k)
- "Implement IPS" → IDS que bloquea automáticamente ($12k)
- "Deploy WAF" → Protege apps web ($10k)
- "Implement DLP" → Previene fuga de datos ($18k)

#### 👥 TEAM (Equipo)
Gestiona recursos humanos
- "Hire L1 Analyst" → +1 analistas junior ($5k)
- "Hire L2 Analyst" → +1 analista senior ($8k)
- "Hire Threat Hunter" → +1 experto ($12k)
- "Team Training" → Mejora capacidades ($3k)

#### 🎯 PROACTIVE (Prevención)
Acciones preventivas
- "Security Awareness" → Entrena usuarios ($3k)
- "Vulnerability Scan" → Busca debilidades ($4k)
- "Threat Intelligence" → Actualiza base de conocimiento ($5k)
- "Penetration Test" → Prueba tus defensas ($8k)

---

## 📖 Glosario de Términos

### Amenazas Comunes

**Phishing:** Emails falsos que parecen legítimos para robar credenciales. La técnica más común.

**Ransomware:** Malware que encripta archivos y pide rescate. Muy destructivo y costoso.

**SQL Injection:** Ataque a bases de datos web manipulando entradas de formularios.

**Brute Force:** Intentar miles de contraseñas automáticamente hasta encontrar la correcta.

**Lateral Movement:** Cuando un atacante ya está dentro y se mueve entre sistemas.

**Credential Dumping:** Robo de contraseñas de la memoria del sistema operativo.

**DDoS:** Inundar servidores con tráfico falso para que colapsen.

**Data Exfiltration:** Robo de información sensible/confidencial.

### Tácticas MITRE ATT&CK

El juego usa el framework **MITRE ATT&CK**, una base de conocimiento real de técnicas de atacantes:

1. **Initial Access:** Cómo entran (phishing, vulnerabilidades)
2. **Execution:** Ejecutar código malicioso
3. **Persistence:** Mantenerse dentro del sistema
4. **Credential Access:** Robar contraseñas
5. **Discovery:** Mapear la red
6. **Lateral Movement:** Moverse entre sistemas
7. **Command & Control:** Comunicarse con servidores atacantes
8. **Exfiltration:** Robar datos
9. **Impact:** Daño final (ransomware, borrar datos)

### Herramientas de Seguridad

**SIEM (Security Information and Event Management):**
- Centraliza logs de toda la infraestructura
- Correlaciona eventos para detectar patrones
- Esencial para visibilidad

**EDR (Endpoint Detection & Response):**
- Protección avanzada en computadoras y servidores
- Detecta malware, procesos sospechosos, comportamientos anómalos

**XDR (Extended Detection & Response):**
- EDR + análisis de red + cloud + email
- Visibilidad total, más cara pero muy efectiva

**IDS (Intrusion Detection System):**
- Monitorea tráfico de red buscando actividad sospechosa
- **Alerta** pero no bloquea

**IPS (Intrusion Prevention System):**
- Como IDS pero **bloquea automáticamente** ataques
- Más potente pero puede tener falsos positivos

**WAF (Web Application Firewall):**
- Protege aplicaciones web de ataques específicos
- Bloquea SQL injection, XSS, etc.

**DLP (Data Loss Prevention):**
- Previene que información sensible salga de la organización
- Monitorea emails, USB, uploads

---

## 💡 Estrategias y Tips

### Para Principiantes

1. **Prioridad 1: Controla las Alertas**
   - Si las alertas superan 30, contrata más analistas
   - Un L2 Analyst procesa 2 alertas/turno (mejor inversión inicial)

2. **Prioridad 2: Mantén Security Score > 50**
   - Si baja de 50, toma acciones PROACTIVE (Security Awareness, Vulnerability Scan)
   - Investiga amenazas activas (INVESTIGATE → Hunt for APT)

3. **Prioridad 3: Invierte Temprano**
   - Primeros 10 turnos: compra WAF o IPS
   - Las herramientas previenen eventos futuros

4. **No Te Quedes Sin Presupuesto**
   - Cada decisión cuesta dinero
   - Si llegas a $0, pierdes

5. **Eventos Críticos = Prioridad Absoluta**
   - Si ves "Ransomware", "Credential Dumping", o "Data Exfiltration" → RESPOND inmediatamente

### Estrategia Intermedia

1. **Balancea Proactivo y Reactivo**
   - 60% acciones PROACTIVE (prevención)
   - 40% RESPOND/INVESTIGATE (reacción)

2. **Equipo Óptimo para Turno 15:**
   - 5 L1 Analysts
   - 4 L2 Analysts
   - 2 Threat Hunters
   - = Capacidad de 19 alertas/turno

3. **Herramientas Completas para Turno 20:**
   - SIEM ✅ (inicial)
   - EDR ✅ (inicial)
   - XDR ✅ ($15k)
   - IDS ✅ (inicial)
   - IPS ✅ ($12k)
   - WAF ✅ ($10k)
   - DLP ✅ ($18k)
   - **Total inversión: $55k**

### Estrategia Avanzada

1. **Optimiza MTTD/MTTR**
   - MTTD < 30 min = excelente detección
   - MTTR < 60 min = respuesta rápida
   - Usa "Team Training" regularmente

2. **Zero Breaches Challenge**
   - Para puntuación perfecta: 0 breaches exitosas
   - Requiere todas las herramientas + equipo grande
   - Focus en PROACTIVE desde turno 1

3. **Budget Management**
   - No gastes más de $5k por turno en promedio
   - Reserva $30k para emergencias (Ransomware Response cuesta $25k)

---

## 🎓 Escenarios de Aprendizaje

### Escenario 1: "Inundación de Phishing"

**Situación:** Turno 5, recibes "Phishing Campaign Detected"
- +15 alertas
- Security Score -5

**Respuesta Correcta:**
1. Si tienes <30 alertas totales: "Analyze Alert Queue" (INVESTIGATE)
2. Si tienes >30 alertas: Contrata L2 Analyst primero (TEAM)
3. Próximo turno: "Security Awareness Training" (PROACTIVE) para prevenir futuros

**Lección:** Phishing es común. Entrena a usuarios para reducir probabilidad.

### Escenario 2: "Ransomware Detectado"

**Situación:** "🔐 Ransomware Detected"
- +60 alertas
- -30 Security Score
- 5 servidores infectados

**Respuesta Correcta:**
1. **INMEDIATO:** "Incident Response" (RESPOND) - Cuesta $25k pero es crítico
2. Si no tienes $25k → GAME OVER probable
3. Próximos turnos: "Deploy Patches" y "Security Awareness"

**Lección:** Ransomware es la amenaza más grave. Necesitas presupuesto de emergencia.

### Escenario 3: "Movimiento Lateral"

**Situación:** "↔️ Pass-the-Hash Attack" (Critical)
- +45 alertas
- 2 servidores infectados

**Respuesta Correcta:**
1. "Isolate Infected Systems" (RESPOND) - Detén la propagación
2. Próximo turno: "Deep Dive Investigation" (INVESTIGATE)
3. "Hunt for APT" para asegurarte que el atacante se fue

**Lección:** Ataques avanzados requieren investigación profunda, no solo bloqueo.

---

## 📊 Criterios de Victoria

### Victoria Básica
- Sobrevivir 30 turnos
- Security Score > 20 al final

### Victoria Buena
- Security Score > 50
- < 5 breaches
- Presupuesto > $50k

### Victoria Excelente
- Security Score > 70
- 0 breaches
- Todas las herramientas activas
- MTTD < 30 min
- MTTR < 60 min

---

## 🔧 Problemas Comunes

**"¡Tengo 80 alertas y solo 3 analistas!"**
→ Contrata urgente 2-3 L2 Analysts. Cada uno procesa 2 alertas/turno.

**"Mi Security Score bajó a 30"**
→ Acciones PROACTIVE: Vulnerability Scan, Security Awareness, Threat Intelligence

**"No tengo presupuesto"**
→ Evitable si: 1) No compras herramientas muy rápido, 2) Balanceas costos, 3) Resuelves incidentes antes que se agraven

**"No entiendo qué es MITRE ATT&CK"**
→ Es un catálogo real de técnicas de atacantes. El juego usa técnicas reales (T1566-Phishing, T1486-Ransomware, etc). Aprenderás con cada evento.

**"¿Cuándo comprar cada herramienta?"**
→ 
- Turno 5-8: WAF (si tienes muchos SQLi/web attacks)
- Turno 8-12: IPS (si IDS detecta muchas intrusiones)
- Turno 10-15: XDR (si tienes presupuesto, mejora detección)
- Turno 15-20: DLP (previene exfiltración de datos)

---

## 🌟 Recursos de Aprendizaje

**Dentro del Juego:**
- Panel "GLOSSARY & HELP" → Términos explicados
- Event Log → Lee descripciones de eventos
- Tooltips → Pasa el mouse sobre herramientas

**Fuera del Juego:**
- [MITRE ATT&CK Framework](https://attack.mitre.org/) - Base de técnicas de atacantes
- [US-CERT](https://www.cisa.gov/) - Alertas de ciberseguridad
- [OWASP Top 10](https://owasp.org/Top10/) - Vulnerabilidades web más comunes

---

## 🎮 ¡Buena Suerte, Comandante!

Recuerda: La ciberseguridad es **proactiva, no reactiva**.

No esperes a ser atacado. Invierte temprano, entrena a tu equipo, mantén herramientas actualizadas.

**"The best defense is a good offense... but in cybersecurity, the best offense is a great defense."**

---

## 📞 Soporte

Si encuentras bugs o tienes preguntas:
- Lee este tutorial completo
- Consulta el panel GLOSSARY & HELP en el juego
- Revisa el README_CYBER.md para detalles técnicos

¡Defiende la red! 🛡️🚀
