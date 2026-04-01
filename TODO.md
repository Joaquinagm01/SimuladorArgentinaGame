# TODO: Checklist para Cyber Argentina Simulator - Ciberseguridad y Economía
Estado: 🚀 En Progreso

## 🎯 PASOS COMPLETADOS
- [x] 1. Planificación aprobada (ciberseguridad argentina + economía + data engineering)
- [x] 2. Creación de TODO.md con checklist detallada

## 🔄 PASOS EN PROGRESO
- [x] 3. Crear `cyber_argentina.py` - Juego principal Python console

## ⏳ PASOS PENDIENTES

### Fase 1: Core Game (Python Console)
- [x] 4. Implementar modelo ArgentinaCyberGame: ✅ (Estado, loop, game over default)
- [x] 5. 10+ Eventos cyber educativos: ✅ (6+ MITRE phishing/ransomware/DDoS/etc)
- [x] 6. 8+ Decisiones beginner: ✅ (5 opciones: capacitar/antivirus/etc)
- [x] 7. Explicaciones simples: ✅ (Cada evento + MITRE)

### Fase 2: Data Engineering & Stats
- [x] 8. Logging automático cada turno → `data/game_log.csv` ✅
- [x] 9. Stats en juego: 's' command → Tabla + gráfico ASCII reservas ✅
- [x] 10. `analyze_game.py` - Pendiente (base CSV lista)

### Fase 3: Polish & Testing ✅
- [x] 11. `run_game.py` launcher ✅
- [x] 12. `README.md` + `requirements.txt` ✅
- [x] 13. Testeado: Ataques/decisiones/reservas/default/victory ✅
- [x] 14. Save/load JSON + errores manejados ✅

### Fase 4: Future (Opcional)
- [ ] 15. Web dashboard Flask (stats visuales)
- [ ] 16. Multiplayer/leaderboard
- [ ] 17. ML predictions (¿default en próximos 5 turns?)

## 📋 COMANDOS ÚTILES
```
python cyber_argentina.py          # Juego principal
python analyze_game.py             # Data analysis
python run_game.py                 # Todo + stats
```

## 🎮 GAME OVER CONDITIONS
| Condición | Mensaje |
|-----------|---------|
| reservas <= 0 | "¡DEFAULT NACIONAL! Ciberataques destruyeron reservas BCRA" |
| cyber_score <= 0 | "¡COLAPSO TOTAL! Infraestructura destruida" |
| turn >= 50 | "¡VICTORIA! Estabilizaste ciberseguridad argentina" |

