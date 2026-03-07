"""
Vercel Serverless Function Handler
Imports the main Flask app from soc_api.py
"""
from soc_api import app

# Vercel needs the app to be exposed as 'app' or exported as a handler
# This file serves as the entry point for Vercel
handler = app
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
