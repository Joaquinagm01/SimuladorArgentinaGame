#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sistema económico del simulador
Variables basadas en la realidad argentina del 2001
"""

class Economy:
    def __init__(self):
        # Variables económicas (valores iniciales representativos del 2001)
        self.pbi = 100  # PBI base
        self.felicidad = 50  # Nivel de felicidad de la población (0-100)
        self.reservas = 20000  # Reservas en millones de USD
        self.inflacion = 5  # Tasa de inflación anual (%)
        self.desempleo = 18  # Tasa de desempleo (%)
        self.deuda_externa = 140000  # Deuda en millones de USD
        self.dolar = 1.0  # Tipo de cambio peso/dólar (convertibilidad 1:1)
        self.depositos_bancarios = 70000  # Depósitos en millones
        
    def display(self):
        """Muestra el estado económico con emojis y drama"""
        
        # Emoji según el estado
        pbi_emoji = "📈" if self.pbi > 100 else "📉" if self.pbi > 80 else "💀"
        felicidad_emoji = "😊" if self.felicidad > 60 else "😐" if self.felicidad > 30 else "😡"
        reservas_emoji = "💰" if self.reservas > 15000 else "⚠️" if self.reservas > 5000 else "🚨"
        inflacion_emoji = "✅" if self.inflacion < 10 else "⚠️" if self.inflacion < 50 else "🔥"
        desempleo_emoji = "👍" if self.desempleo < 10 else "😕" if self.desempleo < 20 else "💔"
        deuda_emoji = "😰" if self.deuda_externa > 100000 else "😅"
        dolar_emoji = "💵" if self.dolar < 2 else "💸" if self.dolar < 5 else "🚀"
        
        print(f"""
{pbi_emoji}  PBI: {self.pbi:.1f}% (base 100)
{felicidad_emoji}  Felicidad: {self.felicidad:.1f}% ({self.get_mood()})
{reservas_emoji}  Reservas: ${self.reservas:,.0f}M USD
{inflacion_emoji}  Inflación: {self.inflacion:.1f}% anual
{desempleo_emoji}  Desempleo: {self.desempleo:.1f}%
{deuda_emoji}  Deuda Externa: ${self.deuda_externa:,.0f}M USD
{dolar_emoji}  Dólar: ${self.dolar:.2f}
🏦  Depósitos Bancarios: ${self.depositos_bancarios:,.0f}M
        """)
    
    def get_mood(self):
        """Devuelve el estado de ánimo de la población"""
        if self.felicidad > 70:
            return "Optimista"
        elif self.felicidad > 50:
            return "Neutro"
        elif self.felicidad > 30:
            return "Preocupado"
        elif self.felicidad > 10:
            return "Enojado"
        else:
            return "EN LA CALLE"
    
    def apply_effects(self, effects):
        """Aplica los efectos de una decisión a la economía"""
        self.pbi += effects.get("pbi", 0)
        self.felicidad += effects.get("felicidad", 0)
        self.reservas += effects.get("reservas", 0)
        self.inflacion += effects.get("inflacion", 0)
        self.desempleo += effects.get("desempleo", 0)
        self.deuda_externa += effects.get("deuda_externa", 0)
        self.dolar += effects.get("dolar", 0)
        self.depositos_bancarios += effects.get("depositos_bancarios", 0)
        
        # Limitar valores a rangos razonables
        self.pbi = max(0, self.pbi)
        self.felicidad = max(0, min(100, self.felicidad))
        self.reservas = max(0, self.reservas)
        self.inflacion = max(0, self.inflacion)
        self.desempleo = max(0, min(100, self.desempleo))
        self.dolar = max(0.5, self.dolar)
        self.depositos_bancarios = max(0, self.depositos_bancarios)
    
    def get_status_summary(self):
        """Devuelve un resumen del estado para análisis"""
        return {
            "pbi": self.pbi,
            "felicidad": self.felicidad,
            "reservas": self.reservas,
            "inflacion": self.inflacion,
            "desempleo": self.desempleo,
            "deuda_externa": self.deuda_externa,
            "dolar": self.dolar,
            "depositos_bancarios": self.depositos_bancarios
        }
