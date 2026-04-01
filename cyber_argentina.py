#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🇦🇷 CYBER ARGENTINA SIMULATOR 🇦🇷
Ciberseguridad del Estado Argentino vs Economía
¡Aprendé ciberseguridad básica protegiendo las reservas del BCRA!

GAME OVER: Si las reservas llegan a 0 → DEFAULT NACIONAL 😱
VICTORIA: Sobreviví 30 turnos sin default 🚀
"""

import random
import os
import csv
import json
from datetime import datetime
from collections import defaultdict

class ArgentinaCyberGame:
    def __init__(self):
        self.turn = 0
        self.max_turns = 30
        self.reservas = 50000  # Millones ARS/USD
        self.cyber_score = 80  # 0-100
        self.threat_level = 0  # 0-100
        self.game_over = False
        self.victory = False
        self.history = []
        self.stats = {
            'events_encountered': defaultdict(int),
            'decisions_made': defaultdict(int),
            'attacks_blocked': 0,
            'successful_breaches': 0
        }
        self.data_dir = 'data'
        os.makedirs(self.data_dir, exist_ok=True)
        self.log_file = os.path.join(self.data_dir, 'game_log.csv')
        self.save_file = os.path.join(self.data_dir, 'save.json')
        self.setup_logging()
    
    def setup_logging(self):
        """Inicializa CSV de logs"""
        if not os.path.exists(self.log_file):
            with open(self.log_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow([
                    'timestamp', 'turn', 'event', 'decision', 'reservas', 
                    'cyber_score', 'threat_level', 'blocked', 'breach'
                ])
    
    def log_turn(self, event, decision, blocked, breach):
        """Log del turno"""
        with open(self.log_file, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                datetime.now().isoformat(), self.turn, event, decision,
                self.reservas, self.cyber_score, self.threat_level, blocked, breach
            ])
    
    def save_game(self):
        """Guardar progreso"""
        data = {
            'turn': self.turn, 'reservas': self.reservas,
            'cyber_score': self.cyber_score, 'threat_level': self.threat_level,
            'history': self.history[-10:], 'stats': self.stats
        }
        with open(self.save_file, 'w') as f:
            json.dump(data, f)
        print("💾 Juego guardado")
    
    def load_game(self):
        """Cargar progreso"""
        if os.path.exists(self.save_file):
            try:
                with open(self.save_file, 'r') as f:
                    data = json.load(f)
                self.turn = data['turn']
                self.reservas = data['reservas']
                self.cyber_score = data['cyber_score']
                self.threat_level = data['threat_level']
                print("📂 Juego cargado!")
                return True
            except:
                pass
        return False
    
    def show_status(self):
        """Mostrar estado con colores/ASCII"""
        reserves_emoji = "💰" if self.reservas > 30000 else "⚠️" if self.reservas > 10000 else "🚨"
        cyber_emoji = "🛡️" if self.cyber_score > 70 else "⚠️" if self.cyber_score > 40 else "💥"
        
        print(f"\n{'='*60}")
        print(f"🔄 TURNO {self.turn}/30  {reserves_emoji} Reservas: ${self.reservas:,.0f}M")
        print(f"{cyber_emoji} Cyber Score: {self.cyber_score}/100  ☠️ Amenazas: {self.threat_level}")
        print('='*60)
    
    def cyber_events(self):
        """Eventos cyber educativos"""
        return [
            {
                "name": "📧 PHISHING MASIVO",
                "desc": "Ataque phishing al BCRA. Empleados reciben emails falsos del 'FMI' pidiendo credenciales.",
                "effects": {"threat": 20, "reservas_loss": 5000},
                "mitre": "T1566 - Phishing"
            },
            {
                "name": "💻 RANSOMWARE BCRA",
                "desc": "Ransomware cifra sistemas del Banco Central. Piden rescate en Bitcoin.",
                "effects": {"threat": 35, "reservas_loss": 12000},
                "mitre": "T1486 - Data Encrypted"
            },
            {
                "name": "🌐 DDoS contra AFIP",
                "desc": "DDoS satura servidores tributarios. Empresas no pueden pagar impuestos.",
                "effects": {"threat": 25, "reservas_loss": 8000},
                "mitre": "T1498 - Network Denial"
            },
            {
                "name": "🔑 Credential Theft ANSES",
                "desc": "Robo de credenciales ANSES. Atacantes acceden a datos jubilados.",
                "effects": {"threat": 30, "reservas_loss": 10000},
                "mitre": "T1003 - Credential Dumping"
            },
            {
                "name": "🕵️ SQL Injection Migraciones",
                "desc": "SQL Injection en DNM roba datos de 1M ciudadanos.",
                "effects": {"threat": 28, "reservas_loss": 9000},
                "mitre": "T1190 - Exploit Public App"
            },
            {
                "name": "🔄 C2 en Ministerio Economía",
                "desc": "Servidor hackeado se comunica con atacantes rusos.",
                "effects": {"threat": 40, "reservas_loss": 15000},
                "mitre": "T1071 - C2 Channel"
            }
        ]
    
    def decisions(self):
        """Decisiones para principiantes"""
        return [
            {
                "name": "1️⃣ Capacitar empleados (Gratis)",
                "desc": "Entrenar contra phishing. Mejora detección básica.",
                "effects": {"cyber_boost": 20, "cost": 0}
            },
            {
                "name": "2️⃣ Comprar Antivirus ($5M)",
                "desc": "Antivirus empresarial bloquea malware común.",
                "effects": {"cyber_boost": 35, "cost": 5000}
            },
            {
                "name": "3️⃣ Contratar consultor ($10M)",
                "desc": "Expertos limpian infección rápido.",
                "effects": {"cyber_boost": 50, "cost": 10000}
            },
            {
                "name": "4️⃣ Ignorar alerta",
                "desc": "Quizás sea falso positivo... ¿o no?",
                "effects": {"cyber_boost": 0, "cost": 0}
            },
            {
                "name": "5️⃣ Reportar CERT.ar",
                "desc": "Notificar equipo nacional. Ayuda futura.",
                "effects": {"cyber_boost": 15, "cost": 0}
            }
        ]
    
    def trigger_event(self):
        """Dispara evento random"""
        event = random.choice(self.cyber_events())
        print(f"\n🚨 ALERTA CIBER: {event['name']}")
        print(f"📖 {event['desc']}")
        print(f"🔬 MITRE: {event['mitre']}")
        return event
    
    def get_stats(self):
        """Estadísticas detalladas"""
        if not self.history:
            print("📊 Aún no hay datos. Jugá más turnos!")
            return
        
        total_turns = len(self.history)
        avg_reservas = sum(h['reservas'] for h in self.history) / total_turns
        block_rate = (self.stats['attacks_blocked'] / total_turns) * 100
        
        print(f"\n📈 ESTADÍSTICAS {self.turn} TURNOS")
        print(f"💰 Reservas promedio: ${avg_reservas:,.0f}M")
        print(f"🛡️ % Ataques bloqueados: {block_rate:.1f}%")
        print(f"💀 Brechas exitosas: {self.stats['successful_breaches']}")
        
        print("\n🔥 Top Amenazas:")
        for event, count in sorted(self.stats['events_encountered'].items(), key=lambda x: x[1], reverse=True)[:3]:
            print(f"   {event}: {count}x")
        
        # Gráfico ASCII reservas
        print("\n📉 Evolución Reservas (últimos 10):")
        recent = self.history[-10:]
        max_r = max(h['reservas'] for h in recent)
        for h in recent:
            bar = int((h['reservas'] / max_r) * 20)
            print(f"   T{self.turn-10+recent.index(h)+1}: {'█' * bar} ${h['reservas']:,.0f}M")
    
    def play_turn(self):
        event = self.trigger_event()
        self.show_status()
        
        print("\n🧠 ¿QUÉ HACÉS, DIRECTOR SOC?")
        for dec in self.decisions():
            print(f"{dec['name']}: {dec['desc']}")
        
        while True:
            choice = input("\n>>> Elegí (1-5): ").strip()
            if choice in ['1','2','3','4','5']:
                break
            print("❌ Opción inválida")
        
        decision = self.decisions()[int(choice)-1]
        print(f"\n⚙️ Ejecutando: {decision['name']}")
        
        # Resolver ataque
        success_chance = self.cyber_score + decision['effects']['cyber_boost'] - event['effects']['threat']
        blocked = random.random() < (success_chance / 150)  # Fácil para principiantes
        breach = not blocked
        
        if blocked:
            print("✅ ¡ATAQUE BLOQUEADO!")
            self.stats['attacks_blocked'] += 1
            loss = event['effects']['reservas_loss'] * 0.2  # Penalidad reducida
        else:
            print("💥 ¡BRECHA EXITOSA!")
            self.stats['successful_breaches'] += 1
            loss = event['effects']['reservas_loss']
        
        self.reservas -= loss
        self.reservas -= int(self.threat_level * 100)  # Decay continuo
        self.cyber_score = max(0, min(100, self.cyber_score - (10 if breach else 2)))
        self.threat_level += random.randint(5,15)
        self.threat_level = min(100, self.threat_level)
        
        cost = decision['effects']['cost']
        if cost > 0:
            self.reservas -= cost
            print(f"💸 Gastaste ${cost:,.0f}M")
        
        self.stats['events_encountered'][event['name']] += 1
        self.stats['decisions_made'][decision['name']] += 1
        
        self.history.append({
            'turn': self.turn, 'reservas': self.reservas,
            'cyber_score': self.cyber_score, 'threat_level': self.threat_level
        })
        
        self.log_turn(event['name'], decision['name'], blocked, breach)
        self.turn += 1
    
    def check_end(self):
        if self.reservas <= 0:
            print("\n💥 ¡DEFAULT NACIONAL!")
            print("Ciberataques destruyeron reservas BCRA. Argentina en crisis económica.")
            self.game_over = True
            return True
        if self.turn >= self.max_turns:
            print("\n🎉 ¡VICTORIA ÉPICA!")
            print("¡Estabilizaste ciberseguridad del Estado por 30 turnos!")
            self.victory = True
            return True
        return False
    
    def run(self):
        print("""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    🇦🇷 CYBER ARGENTINA SIMULATOR 🇦🇷                        ║
║                                                              ║
║  ¡Protegé las reservas del BCRA contra ciberataques!         ║
║                                                              ║
║  Comandos: 's'=stats, 'save'=guardar, 'load'=cargar, 'q'=salir║
╚══════════════════════════════════════════════════════════════╝
        """)
        
        if self.load_game():
            print("(Cargado desde último save)")
        
        while not self.game_over and not self.victory:
            self.show_status()
            
            cmd = input("\n>>> Comando (enter=continuar, s=stats, save/load/q): ").strip().lower()
            
            if cmd == 'q':
                break
            elif cmd == 's':
                self.get_stats()
            elif cmd == 'save':
                self.save_game()
                continue
            elif cmd == 'load':
                self.load_game()
                continue
            elif cmd:
                print("❓ Comando inválido")
                continue
            
            self.play_turn()
            if self.check_end():
                self.get_stats()
                self.save_game()
                break
        
        print("\n📊 Logs en:", self.log_file)
        print("🔍 Analizá con: python analyze_game.py (futuro)")

if __name__ == "__main__":
    game = ArgentinaCyberGame()
    game.run()

