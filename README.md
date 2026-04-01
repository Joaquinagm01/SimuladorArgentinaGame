# Cyber Argentina Simulator 🇦🇷🛡️

## 🎮 ¿Qué es?
Juego educativo de **ciberseguridad básica** para el Estado Argentino.
Protegé las **reservas del BCRA** contra ataques reales (MITRE ATT&CK simplificado).
Si fallás → **DEFAULT NACIONAL** 💥

**Fácil para principiantes**: Explicaciones simples + decisiones 1-clic.

## 🚀 Cómo Jugar
```bash
python cyber_argentina.py
# o
python run_game.py
```

**Comandos en juego:**
- `Enter`: Siguiente turno
- `s`: 📊 Estadísticas + gráfico ASCII
- `save`/`load`: Guardar/cargar
- `q`: Salir

## 📈 Data Engineering
- **Logs**: `data/game_log.csv` (cada turno)
- **Stats en vivo**: Reservas, % bloqueos, top amenazas
- **Próximo**: `analyze_game.py` (pandas + gráficos)

## 🎯 Mecánicas
1. **Ataque random** (Phishing, Ransomware, DDoS...)
2. **Elegí decisión** (Capacitar, Antivirus...)
3. **Resultado**: Reservas -X si falla
4. **GAME OVER**: Reservas ≤ 0 → Default

## 📊 Ejemplo Stats
```
📈 ESTADÍSTICAS 15 TURNOS
💰 Reservas promedio: $25M
🛡️ % Ataques bloqueados: 73.3%
💀 Brechas: 4
🔥 Top: PHISHING MASIVO (5x)
```

## 🔧 Requisitos
Python 3.8+ (stdlib only ✅)

## 📈 Futuro
- [ ] Dashboard web
- [ ] Análisis ML default prediction
- [ ] Leaderboard nacional

¡Aprendé ciberseguridad salvando Argentina! 🚀

