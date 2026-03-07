#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Eventos random que suceden durante el juego
Basados en la realidad argentina (por eso son tan dramáticos)
"""

import random

class EventManager:
    def __init__(self):
        self.events = [
            {
                "name": "📰 Crisis asiática afecta mercados",
                "description": "Los mercados internacionales se desploman. Gracias Asia.",
                "effects": {
                    "pbi": -5,
                    "reservas": -2000,
                    "dolar": 0.2
                },
                "probability": 0.15
            },
            {
                "name": "🌾 Récord de cosecha de soja",
                "description": "El campo produce más que nunca. Good vibes.",
                "effects": {
                    "pbi": 8,
                    "reservas": 3000,
                    "felicidad": 5
                },
                "probability": 0.12
            },
            {
                "name": "✊ Cacerolazo masivo",
                "description": "La gente está en la calle con cacerolas. Mucho ruido.",
                "effects": {
                    "felicidad": -15,
                    "pbi": -2
                },
                "probability": 0.18
            },
            {
                "name": "🏦 Corrida bancaria",
                "description": "Todo el mundo quiere sacar su plata del banco. Pánico total.",
                "effects": {
                    "depositos_bancarios": -15000,
                    "reservas": -5000,
                    "felicidad": -10,
                    "dolar": 0.3
                },
                "probability": 0.10
            },
            {
                "name": "💼 Fuga de capitales",
                "description": "Los ricos se llevan la plata afuera. Clásico.",
                "effects": {
                    "reservas": -4000,
                    "dolar": 0.2
                },
                "probability": 0.15
            },
            {
                "name": "🎉 Argentina gana Copa América",
                "description": "¡CAMPEONES! El fútbol cura todo (temporalmente).",
                "effects": {
                    "felicidad": 20,
                    "pbi": 2
                },
                "probability": 0.05
            },
            {
                "name": "⚡ Crisis energética",
                "description": "Apagones en todo el país. Literal volvimos a la Edad Media.",
                "effects": {
                    "pbi": -6,
                    "felicidad": -12,
                    "desempleo": 1
                },
                "probability": 0.12
            },
            {
                "name": "🌍 El FMI aprueba ajuste",
                "description": "El Fondo te felicita por ajustar. La gente no tanto.",
                "effects": {
                    "deuda_externa": -5000,
                    "felicidad": 3,
                    "reservas": 2000
                },
                "probability": 0.08
            },
            {
                "name": "😷 Brote de cólera",
                "description": "Crisis sanitaria. El sistema de salud colapsa.",
                "effects": {
                    "felicidad": -15,
                    "pbi": -4,
                    "reservas": -2000
                },
                "probability": 0.08
            },
            {
                "name": "📺 Escándalo de corrupción",
                "description": "Alguien de tu gobierno fue descubierto robando. Sorpresa level 0.",
                "effects": {
                    "felicidad": -18,
                    "reservas": -1000
                },
                "probability": 0.15
            },
            {
                "name": "🌟 Inversión extranjera",
                "description": "Una empresa internacional decide invertir en el país. Milagro.",
                "effects": {
                    "pbi": 6,
                    "reservas": 4000,
                    "felicidad": 8,
                    "desempleo": -2
                },
                "probability": 0.08
            },
            {
                "name": "🔥 Piquetes cortan rutas",
                "description": "Movimientos sociales bloquean carreteras. Nadie puede trabajar.",
                "effects": {
                    "pbi": -5,
                    "felicidad": -10,
                    "desempleo": 1
                },
                "probability": 0.16
            }
        ]
    
    def trigger_random_event(self):
        """Dispara un evento random basado en probabilidades"""
        # 30% de chance de que NO pase nada
        if random.random() < 0.30:
            return None
        
        # Seleccionar evento basado en probabilidades
        roll = random.random()
        cumulative_prob = 0
        
        for event in self.events:
            cumulative_prob += event["probability"]
            if roll <= cumulative_prob:
                return event
        
        # Si no se dispara ninguno
        return None
    
    def get_event_by_name(self, name):
        """Busca un evento por nombre"""
        for event in self.events:
            if event["name"] == name:
                return event
        return None
