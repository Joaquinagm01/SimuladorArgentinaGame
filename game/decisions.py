#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sistema de decisiones políticas y económicas
Basado en las opciones reales (y desastrosas) de Argentina 2001
"""

class DecisionManager:
    def __init__(self):
        self.decisions = [
            {
                "name": "💸 Pedir préstamo al FMI",
                "description": "Más deuda nunca fue la solución... ¿o sí?",
                "effects": {
                    "reservas": 5000,
                    "deuda_externa": 8000,
                    "felicidad": -10,
                    "pbi": 5
                }
            },
            {
                "name": "🔒 Implementar el 'Corralito'",
                "description": "Congelar depósitos bancarios. ¿Qué puede salir mal?",
                "effects": {
                    "depositos_bancarios": -10000,
                    "felicidad": -25,
                    "reservas": 3000,
                    "dolar": 0.1
                }
            },
            {
                "name": "💰 Aumentar impuestos",
                "description": "Classic move. La gente te va a amar... not.",
                "effects": {
                    "reservas": 1500,
                    "felicidad": -8,
                    "pbi": -3,
                    "desempleo": 1
                }
            },
            {
                "name": "✂️ Recortar gasto público",
                "description": "Ajuste y despidos. El FMI aprobaría esto.",
                "effects": {
                    "reservas": 2000,
                    "felicidad": -12,
                    "desempleo": 3,
                    "inflacion": -2
                }
            },
            {
                "name": "🏭 Invertir en industria nacional",
                "description": "Apostar al largo plazo. Optimismo = peligroso.",
                "effects": {
                    "pbi": 8,
                    "felicidad": 5,
                    "reservas": -3000,
                    "desempleo": -2,
                    "deuda_externa": 2000
                }
            },
            {
                "name": "📚 Invertir en educación",
                "description": "Educación pública. Suena lindo pero cuesta.",
                "effects": {
                    "felicidad": 10,
                    "pbi": 3,
                    "reservas": -1500,
                    "desempleo": -1
                }
            },
            {
                "name": "💵 Devaluar el peso",
                "description": "Adiós convertibilidad. Hola caos.",
                "effects": {
                    "dolar": 0.8,
                    "felicidad": -20,
                    "pbi": -10,
                    "inflacion": 15,
                    "deuda_externa": 20000  # La deuda en USD se multiplica
                }
            },
            {
                "name": "🎁 Plan social de emergencia",
                "description": "Dar plata a los pobres. Ayuda humanitaria básica.",
                "effects": {
                    "felicidad": 12,
                    "reservas": -2000,
                    "desempleo": -1.5
                }
            },
            {
                "name": "🏦 Rescate bancario",
                "description": "Salvar a los bancos con plata del Estado.",
                "effects": {
                    "depositos_bancarios": 5000,
                    "reservas": -4000,
                    "felicidad": -5,
                    "deuda_externa": 3000
                }
            },
            {
                "name": "🙏 Rezar y no hacer nada",
                "description": "A veces la mejor decisión es... no decidir?",
                "effects": {
                    "felicidad": -5,
                    "inflacion": 2,
                    "desempleo": 0.5
                }
            }
        ]
    
    def get_decisions(self):
        """Devuelve la lista de decisiones disponibles"""
        return self.decisions
    
    def get_decision_by_name(self, name):
        """Busca una decisión por nombre"""
        for decision in self.decisions:
            if decision["name"] == name:
                return decision
        return None
