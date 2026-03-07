"""
API Flask para el Simulador Argentina 2001
Compatible con Vercel Serverless Functions
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os
import random

# Agregar el directorio game al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from game.economy import Economy
from game.decisions import DecisionManager
from game.events import EventManager

app = Flask(__name__)
CORS(app)

# Managers globales
decision_manager = DecisionManager()
event_manager = EventManager()

# Almacenamiento en memoria (para demo, en producción usar Redis/DB)
games = {}

@app.route('/')
def home():
    return jsonify({
        "message": "🇦🇷 Simulador Argentina 2001 API",
        "version": "1.0",
        "endpoints": ["/api/new-game", "/api/game-state", "/api/make-decision", "/api/next-turn"]
    })

def economy_to_state(economy):
    """Convertir Economy a formato API"""
    return {
        'pbi': economy.pbi,
        'reservas': economy.reservas,
        'deuda': economy.deuda_externa / 1000,  # Normalizar
        'desempleo': economy.desempleo,
        'inflacion': economy.inflacion,
        'descontento_social': max(0, 100 - economy.felicidad)
    }

@app.route('/api/new-game', methods=['POST'])
def new_game():
    """Crear nuevo juego"""
    game_id = str(len(games) + 1)
    economy = Economy()
    
    games[game_id] = {
        'economy': economy,
        'turn': 1,
        'history': [],
        'game_over': False
    }
    
    return jsonify({
        'game_id': game_id,
        'state': economy_to_state(economy),
        'turn': 1
    })

@app.route('/api/game-state/<game_id>', methods=['GET'])
def get_game_state(game_id):
    """Obtener estado del juego"""
    if game_id not in games:
        return jsonify({'error': 'Game not found'}), 404
    
    game = games[game_id]
    return jsonify({
        'state': economy_to_state(game['economy']),
        'turn': game['turn'],
        'game_over': game['game_over'],
        'history': game['history'][-5:]  # Últimos 5 turnos
    })

@app.route('/api/decisions', methods=['GET'])
def get_decisions():
    """Obtener todas las decisiones disponibles"""
    decisions = decision_manager.decisions
    return jsonify({
        'decisions': [
            {
                'id': i,
                'title': d['name'],
                'description': d['description'],
                'effects': d['effects']
            }
            for i, d in enumerate(decisions)
        ]
    })

@app.route('/api/make-decision/<game_id>', methods=['POST'])
def make_decision(game_id):
    """Aplicar una decisión"""
    if game_id not in games:
        return jsonify({'error': 'Game not found'}), 404
    
    data = request.json
    decision_id = data.get('decision_id')
    
    game = games[game_id]
    economy = game['economy']
    decisions = decision_manager.decisions
    
    if decision_id < 0 or decision_id >= len(decisions):
        return jsonify({'error': 'Invalid decision'}), 400
    
    decision = decisions[decision_id]
    
    # Aplicar efectos de la decisión
    for key, value in decision['effects'].items():
        if hasattr(economy, key):
            current = getattr(economy, key)
            setattr(economy, key, current + value)
    
    # Seleccionar y aplicar evento random
    event = random.choice(event_manager.events)
    for key, value in event['effects'].items():
        if hasattr(economy, key):
            current = getattr(economy, key)
            setattr(economy, key, current + value)
    
    game['turn'] += 1
    game['history'].append({
        'turn': game['turn'] - 1,
        'decision': decision['name'],
        'event': event['name'],
        'state': economy_to_state(economy)
    })
    
    # Verificar game over
    if economy.reservas <= 0 or economy.desempleo >= 30 or economy.deuda_externa >= 200000:
        game['game_over'] = True
    
    return jsonify({
        'decision': {
            'title': decision['name'],
            'description': decision['description']
        },
        'event': {
            'title': event['name'],
            'description': event['description']
        },
        'state': economy_to_state(economy),
        'turn': game['turn'],
        'game_over': game['game_over']
    })

@app.route('/api/event', methods=['GET'])
def get_event():
    """Obtener un evento random"""
    event = random.choice(event_manager.events)
    return jsonify({
        'title': event['name'],
        'description': event['description']
    })

# Para desarrollo local
if __name__ == '__main__':
    app.run(debug=True, port=5000)
