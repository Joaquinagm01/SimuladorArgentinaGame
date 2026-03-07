#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cyber Defense Simulator - Server Launcher
Starts the Flask API and serves the web interface
"""

import os
import sys
import webbrowser
import time
from threading import Timer

# Add directories to path
base_dir = os.path.dirname(os.path.abspath(__file__))
api_dir = os.path.join(base_dir, 'api')
game_dir = os.path.join(base_dir, 'game')

sys.path.insert(0, api_dir)
sys.path.insert(0, game_dir)

os.chdir(base_dir)

if __name__ == '__main__':
    print("="*60)
    print("🛡️  CYBER DEFENSE SIMULATOR - SERVER")
    print("="*60)
    print("\n🚀 Starting SOC server...")
    print("📍 Server will run at: http://localhost:8080")
    print("🌐 Opening browser automatically...\n")
    print("⚠️  Press Ctrl+C to stop the server\n")
    print("="*60 + "\n")
    
    # Open browser after delay
    Timer(2.0, lambda: webbrowser.open('http://localhost:8080')).start()
    
    # Import and run Flask app
    from soc_api import app
    
    # Run server
    app.run(host='0.0.0.0', port=8080, debug=False)
