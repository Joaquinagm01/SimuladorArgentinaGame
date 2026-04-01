#!/usr/bin/env python3
"""
🚀 Cyber Argentina Launcher
Ejecuta el simulador de ciberseguridad argentina + stats
"""

import subprocess
import sys
import os

def main():
    print("🚀 Starting Cyber Argentina Simulator...")
    print("🎮 Ciberseguridad del Estado + Economía")
    print("📊 's' = stats en juego | Logs: data/game_log.csv\\n")
    
    if not os.path.exists('cyber_argentina.py'):
        print("❌ cyber_argentina.py no encontrado")
        sys.exit(1)
    
    subprocess.run([sys.executable, 'cyber_argentina.py'])

if __name__ == '__main__':
    main()

