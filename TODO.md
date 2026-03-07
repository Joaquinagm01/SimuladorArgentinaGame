# 📋 TODO - Cyber Defense Simulator

## 🎨 MEJORAS VISUALES

### Interfaz Usuario
- [ ] **Tema Claro/Oscuro**: Toggle entre modo Matrix (oscuro) y modo Corporate (claro)
- [x] **Animaciones Suaves**: Transiciones CSS para cambios de estado (fade, slide, scale)
- [x] **Indicadores Visuales de Progreso**: Barras de progreso para Security Score, Budget, Reputation
- [x] **Iconos Animados**: Pulso en amenazas críticas, parpadeo en alertas urgentes
- [ ] **Gráficos de Líneas**: Chart.js para mostrar evolución de métricas por turno
- [ ] **Gráfico de Barras**: Gastos por categoría (Investigate, Respond, Upgrade, Team, Proactive)
- [ ] **Dashboard Minimalista**: Versión aún más compacta para móviles pequeños (<360px)
- [ ] **Modo Alto Contraste**: Para accesibilidad (WCAG 2.1 AAA)
- [ ] **Efectos Partículas**: Al ejecutar decisiones exitosas o alcanzar hitos
- [ ] **Background Dinámico**: Cambiar color/intensidad según estado del juego

### Componentes Visuales
- [ ] **Cards 3D**: Efecto flip 3D en decision cards al hover
- [ ] **Tooltips Ricos**: Tooltips con imágenes, estadísticas y ejemplos
- [ ] **Notificaciones Toast**: Mensajes emergentes para eventos importantes
- [ ] **Badges de Logros**: Insignias visuales por hitos alcanzados
- [ ] **Avatar del Usuario**: Selección de avatar para el SOC Manager
- [ ] **Tema Personalizable**: Selector de color primario (verde, azul, morado, etc.)
- [ ] **Modo Zen**: Esconder paneles secundarios, solo mostrar lo esencial

### Mobile UX
- [ ] **Gestos Táctiles**: Swipe entre tabs, pull-to-refresh
- [ ] **Botones Más Grandes**: 48x48px mínimo para táctil
- [ ] **Teclado en Pantalla**: No obstruir contenido al aparecer
- [ ] **Orientación Landscape**: Layout optimizado para horizontal
- [ ] **PWA Icons**: Iconos para agregar a home screen
- [ ] **Splash Screen**: Pantalla de carga personalizada

---

## 📊 MEJORAS INFORMATIVAS

### Tutoriales & Ayuda
- [x] **Tutorial Interactivo**: Walkthrough paso a paso de los primeros 5 turnos ✅
- [x] **Tooltips Contextuales**: Explicaciones al pasar mouse sobre términos técnicos ✅
- [x] **FAQ Integrado**: Sección de preguntas frecuentes en el juego ✅
- [x] **Glosario Expandido**: Más términos de ciberseguridad con ejemplos reales ✅
- [x] **Casos de Estudio**: Ejemplos de incidentes reales (Sony, Equifax, etc.) ✅
- [x] **Best Practices**: Guía de mejores prácticas SOC durante el juego ✅

### Estadísticas & Analytics
- [x] **Dashboard de Stats**: Estadísticas globales al final del juego ✅
  - Total gastado por categoría ✅
  - Decisiones más usadas ✅
  - Tasa de éxito por tipo ✅
  - Tiempo de juego ✅
- [x] **Timeline Visual**: Línea de tiempo de eventos importantes del juego ✅
- [ ] **Heatmap de Decisiones**: Qué acciones tomaste en qué turnos (visualización mejorada pendiente)
- [ ] **KPIs Avanzados**: MTBF (Mean Time Between Failures), ROE (Return on Effort)

### Feedback Educativo
- [x] **Explicación de Game Over**: Por qué perdiste y qué podrías haber hecho diferente ✅
- [ ] **Sugerencias Post-Acción**: "Esta decisión fue buena porque..." (requiere AI/lógica compleja)
- [x] **Indicador de Eficiencia**: Score de qué tan eficiente fue tu estrategia ✅
- [x] **Comparador de Estrategias**: "Podrías haber gastado 20% menos si..." ✅
- [x] **Links a Documentación**: Enlaces a MITRE ATT&CK, NIST, ISO 27001 ✅

---

## 🛠️ MEJORAS DE APIs

### Backend Optimizaciones
- [x] **API RESTful Completa**: CRUD para todas las entidades ✅
- [x] **Versionado de API**: `/api/v1/`, `/api/v2/` para compatibilidad ✅
- [x] **Rate Limiting**: Limitar requests por IP (Flask-Limiter) ✅
- [x] **Autenticación JWT**: Token-based auth para multiplayer futuro ✅
- [x] **Validación de Schemas**: Pydantic o Cerberus para validar inputs ✅
- [x] **Documentación Swagger**: OpenAPI spec con Swagger UI ✅
- [x] **CORS Configurado**: Permitir requests desde dominios específicos ✅
- [x] **Compression**: Gzip responses para reducir bandwidth ✅
- [ ] **Caching**: Redis/Memcached para estados de juego frecuentes

### Nuevos Endpoints
- [x] **GET /api/stats/global**: Estadísticas globales de todos los jugadores ✅
- [x] **POST /api/game/save**: Guardar partida en servidor ✅
- [x] **GET /api/game/load/:id**: Cargar partida guardada ✅
- [x] **GET /api/leaderboard**: Top 100 jugadores por score ✅
- [x] **GET /api/game/:id/history**: Historial de decisiones y eventos ✅
- [ ] **POST /api/analytics**: Enviar eventos de analytics
- [ ] **GET /api/scenarios**: Lista de escenarios predefinidos
- [ ] **POST /api/challenge**: Crear desafío para otro jugador
- [ ] **WebSocket /ws/game/:id**: Updates en tiempo real

### GraphQL (Alternativa)
- [ ] **GraphQL Endpoint**: `/api/graphql` para queries flexibles
- [ ] **Subscriptions**: Para updates en tiempo real
- [ ] **Schema Completo**: Tipos para Game, Decision, Event, Stats
- [ ] **Apollo Client**: Integración frontend con Apollo

---

## 🗄️ MEJORAS DE BASE DE DATOS

### Migración a DB
- [x] **SQLite**: Para guardar partidas localmente (sin servidor) ✅
- [ ] **PostgreSQL**: Para producción con múltiples usuarios
- [ ] **MongoDB**: Alternativa NoSQL para flexibilidad de schemas
- [ ] **Supabase**: Backend-as-a-Service con auth y DB
- [ ] **Firebase**: Realtime DB + Auth + Hosting integrado

### Schema de Datos
```sql
- [x] Tabla: users (id, username, email, created_at) ✅
- [x] Tabla: games (id, user_id, session_id, started_at, ended_at, score) ✅
- [x] Tabla: game_states (id, game_id, turn, state_json) ✅
- [x] Tabla: decisions (id, game_id, turn, decision_id, cost) ✅
- [x] Tabla: events (id, game_id, turn, event_name, severity) ✅
- [x] Tabla: achievements (id, user_id, achievement_type, unlocked_at) ✅
- [x] Tabla: leaderboard (user_id, total_score, games_played, avg_score) ✅
```

### Features DB
- [x] **Migraciones**: Alembic para versionar cambios de schema ✅
- [ ] **Backup Automático**: Cron job para backups diarios
- [x] **Índices Optimizados**: Para queries frecuentes ✅
- [ ] **Particionado**: Por fecha para tablas grandes
- [ ] **Replicación**: Master-Slave para alta disponibilidad

---

## 🎮 MEJORAS DE GAMEPLAY

### Modos de Juego
- [ ] **Modo Historia**: Campañas con narrativa (5 misiones)
- [ ] **Modo Supervivencia**: Sobrevivir tantos turnos como sea posible
- [ ] **Modo Desafío**: Objetivos específicos (ej: "Gasta menos de $100k")
- [ ] **Modo Infinito**: Sin límite de turnos, ver cuánto aguantas
- [ ] **Modo Tutorial**: 10 turnos guiados paso a paso
- [ ] **Modo Realista**: Eventos basados en incidentes reales
- [ ] **Modo Competitivo**: 1v1 contra otro jugador

### Dificultades
- [ ] **Fácil**: Actual (recursos 2.5x, costos 60-80%)
- [ ] **Normal**: Balance estándar (como era originalmente)
- [ ] **Difícil**: Menos recursos, eventos más frecuentes
- [ ] **Experto**: Para profesionales SOC, eventos MITRE reales
- [ ] **Pesadilla**: RNG extremo, máxima dificultad
- [ ] **Personalizado**: Sliders para ajustar recursos/dificultad

### Mecánicas Nuevas
- [ ] **Sistema de Niveles**: XP y levels para desbloquear contenido
- [ ] **Skill Tree**: Árbol de habilidades para el SOC Manager
- [ ] **Equipment Upgrades**: Mejorar herramientas con tiers (SIEM Básico → Avanzado)
- [ ] **Random Events**: Eventos sorpresa que requieren decisión inmediata
- [ ] **Dilemmas Morales**: Decisiones éticas (ej: pagar ransomware o no)
- [ ] **Reputation System**: Afecta costos, disponibilidad de analistas
- [ ] **Board of Directors**: Reuniones cada 10 turnos, debes reportar
- [ ] **Auditorías**: Inspecciones sorpresa que evalúan tu SOC
- [ ] **Cyber Insurance**: Comprar seguros que cubren costos de incidentes
- [ ] **Vendor Management**: Contratar proveedores externos (MDR, IR)

### Progresión
- [ ] **Achievements**: 50+ logros desbloqueables
  - "First Blood": Bloquear primer ataque
  - "Budget Master": Terminar con >$500k
  - "Perfect Score": Llegar a turno 30 con score 100
  - "Firefighter": Manejar 5+ amenazas simultáneas
  - "Penny Pincher": Ganar gastando <$100k
- [ ] **Unlockables**: Desbloquear herramientas/analistas especiales
- [ ] **Ranks**: Títulos según performance (Novice → Expert → Master)
- [ ] **Badges**: Colección de insignias por categoría

---

## 🚀 FRAMEWORKS & TECNOLOGÍAS

### Frontend
- [ ] **React**: Migrar a React para mejor state management
- [ ] **Vue.js**: Alternativa más simple que React
- [ ] **Svelte**: Framework ultrarrápido y ligero
- [ ] **TypeScript**: Type safety para menos bugs
- [ ] **Tailwind CSS**: Utility-first CSS framework
- [ ] **Material-UI**: Componentes pre-hechos profesionales
- [ ] **Framer Motion**: Animaciones avanzadas y fluidas
- [ ] **React Query**: Data fetching y caching
- [ ] **Zustand/Recoil**: State management moderno
- [ ] **Vite**: Build tool más rápido que Webpack

### Backend
- [ ] **FastAPI**: Python framework más rápido que Flask
- [ ] **Django**: Full-stack framework con admin panel
- [ ] **Node.js + Express**: Backend JavaScript
- [ ] **Nest.js**: Framework enterprise para Node
- [ ] **GraphQL**: Con Strawberry (Python) o Apollo (Node)
- [ ] **Redis**: Caching y sessions
- [ ] **Celery**: Task queue para jobs asíncronos
- [ ] **Docker**: Containerización completa
- [ ] **Kubernetes**: Orquestación para escalabilidad

### Testing
- [ ] **Jest**: Unit tests para JavaScript
- [ ] **Pytest**: Unit tests para Python
- [ ] **Cypress**: E2E tests para frontend
- [ ] **Playwright**: Alternative a Cypress, más rápido
- [ ] **pytest-cov**: Code coverage para Python
- [ ] **Lighthouse CI**: Performance testing automatizado
- [ ] **Load Testing**: Locust o K6 para stress tests

### DevOps & CI/CD
- [ ] **GitHub Actions**: CI/CD pipeline automatizado
- [ ] **Docker Compose**: Local development environment
- [ ] **Terraform**: Infrastructure as Code
- [ ] **Monitoring**: Sentry para error tracking
- [ ] **Logging**: ELK Stack o Datadog
- [ ] **APM**: Application Performance Monitoring
- [ ] **Blue/Green Deployment**: Zero-downtime deploys

---

## 💾 PERSISTENCIA & GUARDADO

### Save System
- [x] **LocalStorage**: Guardar partida en navegador ✅
- [x] **Auto-Save**: Cada 5 turnos automáticamente ✅
- [x] **Multiple Saves**: 3 slots de guardado ✅
- [x] **Save States**: Volver a turnos anteriores (time travel) ✅
- [x] **Cloud Save**: Sincronizar entre dispositivos ✅
- [x] **Export/Import**: Descargar save como JSON ✅
- [x] **Resume Game**: Continuar partida al reabrir navegador ✅

---

## 📱 MEJORAS MOBILE

### PWA (Progressive Web App)
- [x] **Service Worker**: Funcionar offline ✅
- [x] **App Manifest**: Icono y nombre para home screen ✅
- [x] **Push Notifications**: Notificar eventos importantes ✅
- [x] **Background Sync**: Sincronizar cuando haya conexión ✅
- [x] **Install Prompt**: Sugerir instalar como app ✅
- [x] **Share Target**: Recibir shares de otras apps ✅
- [x] **Shortcuts**: Quick actions desde home screen icon ✅

### Optimizaciones Mobile
- [x] **Lazy Loading**: Cargar imágenes/componentes solo cuando se necesiten ✅
- [x] **Image Optimization**: WebP, tamaños responsive ✅
- [x] **Reduce JS Bundle**: Code splitting por ruta ✅
- [x] **Critical CSS**: Inline CSS crítico en HTML ✅
- [x] **Font Loading**: Optimizar carga de fuentes ✅
- [x] **Lighthouse Score 90+**: Performance audit ✅

---

## 🎓 CONTENIDO EDUCATIVO

### Recursos Integrados
- [x] **MITRE ATT&CK Navigator**: Integrar visualización de técnicas ✅
- [x] **CIS Controls**: Mapear decisiones a controles CIS ✅
- [x] **NIST Cybersecurity Framework**: Alinear con framework NIST ✅
- [x] **ISO 27001**: Referencias a controles ISO ✅
- [x] **Cyber Kill Chain**: Explicar fases de ataques ✅
- [x] **OWASP Top 10**: Incluir vulnerabilidades web ✅
- [x] **Links a Certificaciones**: CISSP, CISM, CEH, OSCP ✅

### Gamificación Educativa
- [x] **Quiz Mode**: Preguntas de cybersecurity entre turnos ✅
- [x] **Flashcards**: Términos técnicos para memorizar ✅
- [x] **Simulaciones**: Escenarios realistas de IR ✅
- [x] **Career Path**: Mostrar camino de carrera en cybersecurity ✅
- [x] **Salary Info**: Información salarial de roles (L1, L2, Hunter) ✅

---

## 🔒 SEGURIDAD

### Security Features
- [ ] **Input Sanitization**: Prevenir XSS, SQL Injection
- [ ] **HTTPS Only**: Forzar conexión segura
- [ ] **CSP Headers**: Content Security Policy
- [ ] **Rate Limiting**: Prevenir abuse de API
- [ ] **CAPTCHA**: En registro/login para prevenir bots
- [ ] **2FA**: Two-Factor Authentication opcional
- [ ] **Session Timeout**: Expirar sesiones inactivas
- [ ] **Audit Logs**: Registrar todas las acciones de usuario
- [ ] **Encryption**: Datos sensibles encriptados en DB

---

## 📈 ANALYTICS & TRACKING

### Métricas
- [ ] **Google Analytics**: Eventos personalizados
- [ ] **Mixpanel**: Product analytics avanzado
- [ ] **Hotjar**: Heatmaps y session recordings
- [ ] **PostHog**: Open-source analytics
- [ ] **Custom Events**: Track decisiones, game overs, victorias
- [ ] **Funnels**: Analizar abandono de usuarios
- [ ] **Cohort Analysis**: Retención por cohorte
- [ ] **A/B Testing**: Experimentar con features

---

## 🎨 CUSTOMIZACIÓN

### Personalización
- [ ] **Custom Scenarios**: Editor de escenarios personalizado
- [ ] **Custom Events**: Crear eventos propios
- [ ] **Custom Decisions**: Agregar decisiones custom
- [ ] **Workshop Steam**: Compartir escenarios custom (si migra a Steam)
- [ ] **Modding Support**: API para mods de comunidad
- [ ] **Custom Themes**: Editor visual de temas

---

## 🌍 INTERNACIONALIZACIÓN

### i18n (Internationalization)
- [ ] **English**: Traducción completa
- [ ] **Portuguese**: Para mercado Brasil
- [ ] **French**: Para mercado Europa
- [ ] **German**: Para mercado Europa
- [ ] **Japanese**: Para mercado Asia
- [ ] **Sistema i18n**: React-i18next o similar
- [ ] **Currency Localization**: Mostrar moneda local
- [ ] **Date Formats**: Formatos de fecha regionales

---

## 🚀 DEPLOYMENT & HOSTING

### Plataformas
- [ ] **Vercel**: Actual, optimizar configuración
- [ ] **Netlify**: Alternativa con analytics gratis
- [ ] **Railway**: Para backend con DB
- [ ] **Render**: Full-stack hosting
- [ ] **AWS**: S3 + CloudFront + Lambda
- [ ] **Google Cloud**: Cloud Run + Firestore
- [ ] **Azure**: App Service + Cosmos DB
- [ ] **DigitalOcean**: VPS con Docker

### CDN & Performance
- [ ] **Cloudflare**: CDN + DDoS protection + Analytics
- [ ] **Image CDN**: Cloudinary o Imgix
- [ ] **DNS Optimization**: Configurar DNS correctamente
- [ ] **Domain Custom**: Comprar dominio .gg o .io

---

## 🎯 MARKETING & GROWTH

### Visibility
- [ ] **SEO Optimization**: Meta tags, structured data
- [ ] **Open Graph**: Rich previews en redes sociales
- [ ] **Twitter Cards**: Cards optimizadas para Twitter
- [ ] **Blog**: Artículos sobre cybersecurity
- [ ] **YouTube**: Videos tutoriales y gameplays
- [ ] **Twitch**: Streams jugando el simulador
- [ ] **Reddit**: Post en r/cybersecurity, r/netsec
- [ ] **Product Hunt**: Lanzamiento público
- [ ] **Hacker News**: Show HN post

### Monetización (Opcional)
- [ ] **Premium Version**: Sin ads, features extras
- [ ] **Donations**: Patreon o Buy Me a Coffee
- [ ] **Sponsorships**: Sponsors de empresas cybersec
- [ ] **Courses**: Cursos pagos basados en el juego
- [ ] **Merchandise**: Camisetas, stickers

---

## 🐛 BUG FIXES & QOL

### Quality of Life
- [ ] **Undo Button**: Deshacer última decisión
- [ ] **Speed Control**: Modo rápido para expertos
- [ ] **Auto-Play**: IA juega por ti (demo mode)
- [ ] **Keyboard Shortcuts**: Hotkeys para acciones comunes
- [ ] **Search Decisions**: Buscar decisiones por nombre
- [ ] **Favorites**: Marcar decisiones favoritas
- [ ] **Recently Used**: Mostrar decisiones recientes
- [ ] **Batch Actions**: Ejecutar múltiples decisiones a la vez

### Bugs Conocidos
- [ ] Revisar logs de consola en producción
- [ ] Test en Safari/iOS (puede tener issues)
- [ ] Test en navegadores viejos (IE11 si es necesario)
- [ ] Memory leaks en sesiones largas
- [ ] Touch events en tablets

---

## 📚 DOCUMENTACIÓN

### Docs Técnica
- [ ] **README Completo**: Setup, arquitectura, contributing
- [ ] **CONTRIBUTING.md**: Guía para contributors
- [ ] **CODE_OF_CONDUCT.md**: Código de conducta
- [ ] **ARCHITECTURE.md**: Diagramas de arquitectura
- [ ] **API_DOCS.md**: Documentación completa de API
- [ ] **DEPLOYMENT.md**: Guía de deployment
- [ ] **Docstrings**: Documentar todas las funciones Python
- [ ] **JSDoc**: Documentar funciones JavaScript
- [ ] **Wiki**: GitHub Wiki con tutoriales

### Docs Usuario
- [ ] **Manual de Usuario**: PDF descargable
- [ ] **Video Tutoriales**: Serie en YouTube
- [ ] **FAQ Extensa**: 50+ preguntas comunes
- [ ] **Troubleshooting**: Guía de resolución de problemas
- [ ] **Changelog**: Historial de cambios por versión

---

## 🎬 CONTENIDO VISUAL

### Assets
- [ ] **Logo Profesional**: Diseño de logo único
- [ ] **Favicon**: Icono para pestaña del navegador
- [ ] **Screenshots**: Capturas profesionales para marketing
- [ ] **Demo GIF**: GIF animado del gameplay
- [ ] **YouTube Trailer**: Video promocional de 1 minuto
- [ ] **Infografía**: Resumen visual del juego

---

## 📊 PRIORIDAD SUGERIDA

### 🔥 URGENTE (Hacer Ya)
1. ✅ PWA básico (manifest + service worker)
2. ✅ Save system (localStorage + auto-save)
3. ✅ Modo Tutorial interactivo
4. ✅ Achievements básicos (10 logros)
5. ✅ Leaderboard local

### 🟡 IMPORTANTE (Próximos 2 meses)
1. Migrar a React + TypeScript
2. Base de datos (Supabase)
3. Sistema de cuentas
4. Multiplayer básico (leaderboard global)
5. Gráficos de estadísticas (Chart.js)

### 🟢 DESEABLE (Largo Plazo)
1. Modo Historia con narrativa
2. WebSocket para tiempo real
3. Mobile apps nativas (React Native)
4. Modos de juego adicionales
5. Customización avanzada

---

## 🎯 KPIs DE ÉXITO

- [ ] **10,000** usuarios únicos en primer mes
- [ ] **50%** tasa de retención día 7
- [ ] **500** partidas completadas por día
- [ ] **4.5/5** rating promedio de usuarios
- [ ] **90+** Lighthouse Performance score
- [ ] **<2s** tiempo de carga inicial
- [ ] **<100ms** respuesta API promedio

---

## 📝 NOTAS

- Priorizar mejoras que impacten **experiencia educativa**
- Mantener el juego **accesible y gratis**
- Código **open source** en GitHub
- Comunidad **activa** en Discord
- Updates **regulares** (cada 2 semanas)

---

**Última actualización**: 7 de Marzo, 2026
**Mantenedor**: @Joaquinagm01
**Contribuidores**: ¡Se aceptan PRs! 🚀
