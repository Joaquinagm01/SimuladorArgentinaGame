#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🇦🇷 SIMULADOR ARGENTINA 2001 🇦🇷
El simulador más realista de gobernar Argentina en su peor momento.
¿Podrás evitar el default? (Spoiler: probablemente no)
"""

import os
import sys
from economy import Economy
from decisions import DecisionManager
from events import EventManager
import csv
from datetime import datetime

class ArgentinaSimulator:
    def __init__(self):
        self.economy = Economy()
        self.decision_manager = DecisionManager()
        self.event_manager = EventManager()
        self.turno = 1
        self.max_turnos = 20
        self.game_over = False
        self.data_file = "../data/game_data.csv"
        
    def setup_data_file(self):
        """Crea el archivo CSV si no existe"""
        os.makedirs("../data", exist_ok=True)
        if not os.path.exists(self.data_file):
            with open(self.data_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow([
                    "timestamp", "turno", "decision", "pbi", "felicidad", 
                    "reservas", "inflacion", "desempleo", "deuda_externa",
                    "dolar", "depositos_bancarios", "event"
                ])
    
    def show_status(self):
        """Muestra el estado actual del país"""
        print("\n" + "="*60)
        print(f"📅 TURNO {self.turno} - ¿QUÉ HACES, PRESIDENTE?")
        print("="*60)
        self.economy.display()
        print("="*60)
    
    def save_turn_data(self, decision_name, event_name=""):
        """Guarda los datos del turno actual"""
        with open(self.data_file, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([
                datetime.now().isoformat(),
                self.turno,
                decision_name,
                self.economy.pbi,
                self.economy.felicidad,
                self.economy.reservas,
                self.economy.inflacion,
                self.economy.desempleo,
                self.economy.deuda_externa,
                self.economy.dolar,
                self.economy.depositos_bancarios,
                event_name
            ])
    
    def check_game_over(self):
        """Verifica si el juego terminó (mal)"""
        if self.economy.reservas <= 0:
            print("\n💥 GAME OVER: TE QUEDASTE SIN RESERVAS")
            print("El FMI te llama... para reírse.")
            self.game_over = True
            return True
            
        if self.economy.felicidad <= 0:
            print("\n💥 GAME OVER: REVOLUCIÓN POPULAR")
            print("La gente está en la calle gritando '¡Que se vayan todos!'")
            self.game_over = True
            return True
            
        if self.economy.dolar > 10:
            print("\n💥 GAME OVER: DOLARIZACIÓN FORZADA")
            print("El dólar está más caro que la nafta. Literalmente.")
            self.game_over = True
            return True
            
        if self.economy.inflacion > 200:
            print("\n💥 GAME OVER: HIPERINFLACIÓN")
            print("Necesitás una carretilla para comprar pan. Como en los '90.")
            self.game_over = True
            return True
            
        return False
    
    def check_victory(self):
        """Verifica si ganaste (poco probable)"""
        if self.turno > self.max_turnos:
            if self.economy.pbi > 120 and self.economy.felicidad > 60:
                print("\n🎉 ¡VICTORIA ÉPICA!")
                print("Lograste gobernar Argentina sin que explote todo.")
                print("Esto es más difícil que Dark Souls.")
                return True
            else:
                print("\n😐 SOBREVIVISTE... APENAS")
                print("El país no explotó, pero tampoco mejoró mucho.")
                print("Típico gobierno argentino.")
                return True
        return False
    
    def play_turn(self):
        """Ejecuta un turno del juego"""
        self.show_status()
        
        # Mostrar decisiones disponibles
        print("\n💡 TUS OPCIONES (elegí sabiamente... o no):\n")
        decisions = self.decision_manager.get_decisions()
        for i, decision in enumerate(decisions, 1):
            print(f"{i}. {decision['name']}")
            print(f"   {decision['description']}")
            print()
        
        # Obtener decisión del jugador
        while True:
            try:
                choice = input(">>> Tu decisión (1-" + str(len(decisions)) + "): ")
                choice_idx = int(choice) - 1
                if 0 <= choice_idx < len(decisions):
                    break
                print("❌ Número inválido. Probá de nuevo.")
            except ValueError:
                print("❌ Por favor ingresá un número.")
        
        # Aplicar decisión
        decision = decisions[choice_idx]
        print(f"\n⚙️  Aplicando: {decision['name']}...")
        self.economy.apply_effects(decision['effects'])
        
        # Evento random
        event = self.event_manager.trigger_random_event()
        event_name = ""
        if event:
            print(f"\n🎲 ¡EVENTO RANDOM! {event['name']}")
            print(f"   {event['description']}")
            self.economy.apply_effects(event['effects'])
            event_name = event['name']
        
        # Guardar datos
        self.save_turn_data(decision['name'], event_name)
        
        # Avanzar turno
        self.turno += 1
        
        input("\nPresioná ENTER para continuar...")
    
    def run(self):
        """Inicia el juego"""
        print("""
        ╔═══════════════════════════════════════════════════════════╗
        ║                                                           ║
        ║        🇦🇷  SIMULADOR ARGENTINA 2001  🇦🇷                ║
        ║                                                           ║
        ║     "Que se vayan todos" - El Simulador Presidencial     ║
        ║                                                           ║
        ╚═══════════════════════════════════════════════════════════╝
        
        Sos el presidente de Argentina en el año 2001.
        El país está al borde del colapso económico.
        Cada decisión cuenta. Cada turno es una aventura.
        
        OBJETIVO: Sobrevivir 20 turnos sin que explote todo.
        (Buena suerte... la vas a necesitar)
        """)
        
        input("Presioná ENTER para empezar el desastre...")
        
        self.setup_data_file()
        
        while not self.game_over:
            self.play_turn()
            
            if self.check_game_over():
                break
                
            if self.check_victory():
                break
        
        print("\n" + "="*60)
        print("🎮 FIN DEL JUEGO")
        print("="*60)
        print(f"\n📊 Datos guardados en: {self.data_file}")
        print("Analizá tus decisiones con el notebook de análisis!")
        

if __name__ == "__main__":
    game = ArgentinaSimulator()
    game.run()
