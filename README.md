# 🇦🇷 Simulador Argentina 2001 🇦🇷

> _"Que se vayan todos" - El juego_

Un simulador político-económico basado en la crisis argentina del 2001. Toma decisiones como presidente y trata de no hundir el país (spoiler: es más difícil de lo que parece).

## 🎮 ¿De qué se trata?

Sos el presidente de Argentina en plena crisis del 2001. El país está al borde del colapso económico. Cada turno tenés que tomar decisiones que afectan:

- 💰 **PBI**: El crecimiento económico
- 😊 **Felicidad**: El humor de la población
- 💵 **Reservas**: Dólares en el Banco Central
- 📈 **Inflación**: Cuánto sube todo
- 👔 **Desempleo**: La gente sin laburo
- 🌎 **Deuda Externa**: Lo que le debés al mundo
- 💸 **Dólar**: El tipo de cambio
- 🏦 **Depósitos**: La plata en los bancos

## 🎯 Objetivo

Sobrevivir 20 turnos sin que:
- Se te acaben las reservas
- La gente haga una revolución
- El dólar se vaya a la estratosfera
- La inflación te destruya

## 🚀 Cómo jugar

### Requisitos
- Python 3.7+
- pandas (para análisis)
- matplotlib (para gráficos)
- jupyter (para el notebook de análisis)

### Instalación

```bash
# Clonar el repo
git clone https://github.com/Joaquinagm01/SimuladorArgentinaGame.git
cd SimuladorArgentinaGame

# Instalar dependencias
pip install pandas matplotlib jupyter notebook
```

### Ejecutar el juego

```bash
cd game
python main.py
```

### Analizar tus decisiones

Después de jugar, podés analizar tus datos:

```bash
cd analysis
jupyter notebook analysis.ipynb
```

## 📊 Características

### 🎲 Sistema de eventos random
- Crisis internacionales
- Cacerolazos
- Récords de cosecha
- Escándalos de corrupción
- ¡Y más desastres!

### 💡 Decisiones realistas
- Pedir préstamos al FMI
- Implementar el corralito
- Devaluar el peso
- Invertir en educación
- Rezar y no hacer nada

### 📈 Análisis de datos
- Gráficos de evolución económica
- Correlaciones entre decisiones
- Impacto de políticas
- Patrones de gobierno

## 🏗️ Estructura del proyecto

```
SimuladorArgentinaGame/
│
├── game/               # Motor del juego
│   ├── main.py        # Archivo principal
│   ├── economy.py     # Sistema económico
│   ├── decisions.py   # Decisiones disponibles
│   └── events.py      # Eventos random
│
├── data/              # Datos generados
│   └── game_data.csv  # Dataset de tus partidas
│
├── analysis/          # Análisis de datos
│   └── analysis.ipynb # Notebook de análisis
│
└── README.md          # Este archivo
```

## 📝 Formato de datos

Cada partida genera un CSV con:

```csv
timestamp, turno, decision, pbi, felicidad, reservas, inflacion, 
desempleo, deuda_externa, dolar, depositos_bancarios, event
```

Perfecto para análisis con pandas, Power BI, Tableau, etc.

## 🎓 Contexto histórico

La crisis del 2001 fue uno de los peores momentos económicos de Argentina:
- Default de deuda más grande de la historia
- Corralito bancario (congelamiento de depósitos)
- 5 presidentes en 2 semanas
- Protestas masivas ("Que se vayan todos")
- Desempleo del 25%
- Pobreza del 50%

Este simulador te permite experimentar (sin el trauma real) qué se siente gobernar en esas condiciones.

## 💼 Uso como proyecto de portfolio

Este proyecto es ideal para mostrar en entrevistas porque combina:
- ✅ Programación (Python, OOP)
- ✅ Análisis de datos (pandas, visualización)
- ✅ Domain knowledge (economía, política)
- ✅ Creatividad (gamificación de conceptos complejos)

## 🤝 Contribuir

Pull requests bienvenidos! Ideas:
- Más decisiones
- Más eventos
- Dificultades (fácil, normal, "peronismo extremo")
- Interfaz gráfica
- Multijugador
- Modo "historia" con eventos reales del 2001

## 📄 Licencia

MIT License - Hacé lo que quieras con esto.

## 🙏 Créditos

Inspirado en la crisis argentina del 2001 y en todos los presidentes que trataron (y fallaron) en resolverla.

---

**Nota**: Este es un juego educativo/humorístico. No es un análisis económico serio ni una crítica política. Es solo para aprender programación y análisis de datos de forma divertida (y algo traumática).

**¿Podés hacerlo mejor que De la Rúa? Jugalo y descubrilo.**

🇦🇷 Viva la patria 🇦🇷
