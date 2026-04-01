#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Flask API for Cyber Defense Simulator
RESTful endpoints for web/mobile gameplay
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
try:
    from flask_limiter import Limiter
    from flask_limiter.util import get_remote_address
    LIMITER_AVAILABLE = True
except ImportError:
    LIMITER_AVAILABLE = False

    def get_remote_address():
        return "0.0.0.0"

    class Limiter:  # Graceful no-op fallback
        def __init__(self, *args, **kwargs):
            pass

        def limit(self, *args, **kwargs):
            def decorator(func):
                return func
            return decorator

try:
    from flask_compress import Compress
    COMPRESS_AVAILABLE = True
except ImportError:
    COMPRESS_AVAILABLE = False

    def Compress(app):
        return app

try:
    from flask_swagger_ui import get_swaggerui_blueprint
    SWAGGER_AVAILABLE = True
except ImportError:
    SWAGGER_AVAILABLE = False
import sys
import os
import json
import tempfile

# Add game directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'game'))

from security import SecuritySystem
from soc_decisions import SOCDecisionManager
from cyber_events import CyberEventManager

# Database imports
try:
    from database import init_db
    from db_service import get_db_service
    DB_ENABLED = True
    print("✅ Database enabled")
except ImportError as e:
    print(f"⚠️ Database not available: {e}")
    DB_ENABLED = False

import csv
from datetime import datetime
import random

# Import schemas and auth
try:
    from schemas import (
        ExecuteDecisionSchema, SaveGameSchema, LeaderboardSchema,
        DecisionCategorySchema, validate_request
    )
    from auth import (
        generate_token, token_required, create_user, authenticate_user
    )
    SCHEMAS_ENABLED = True
except ImportError as e:
    print(f"⚠️ Schemas/Auth not available: {e}")
    SCHEMAS_ENABLED = False
    # Dummy decorator if schemas not available
    def validate_request(schema): 
        def decorator(f): return f
        return decorator
    def token_required(optional=False):
        def decorator(f): return f
        return decorator

app = Flask(__name__, static_folder='../public', static_url_path='')

# ============= CORS Configuration =============
# Configure CORS for specific domains (production ready)
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '*').split(',')
CORS(app, resources={
    r"/api/*": {
        "origins": ALLOWED_ORIGINS,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": True,
        "max_age": 3600
    }
})

# ============= Rate Limiting =============
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per hour", "50 per minute"],
    storage_uri="memory://",
    strategy="fixed-window"
)

# ============= Compression =============
Compress(app)
app.config['COMPRESS_MIMETYPES'] = [
    'text/html', 'text/css', 'text/xml',
    'application/json', 'application/javascript'
]
app.config['COMPRESS_LEVEL'] = 6  # Gzip compression level
app.config['COMPRESS_MIN_SIZE'] = 500  # Min bytes to compress

# Initialize database on startup
if DB_ENABLED:
    try:
        init_db()
        db_service = get_db_service()
    except Exception as e:
        DB_ENABLED = False
        print(f"⚠️ Database init failed, continuing without DB: {e}")

# ============= Swagger UI Configuration =============
SWAGGER_URL = '/api/docs'
API_URL = '/api/swagger.json'

if SWAGGER_AVAILABLE:
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app_name': "Cyber Defense Simulator API",
            'docExpansion': 'list',
            'defaultModelsExpandDepth': 2
        }
    )
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

# Serve swagger.json
@app.route('/api/swagger.json')
def swagger_json():
    """Serve OpenAPI specification"""
    swagger_path = os.path.join(os.path.dirname(__file__), 'swagger.json')
    with open(swagger_path, 'r') as f:
        return jsonify(json.load(f))

# ============= API Versioning Helper =============
def add_versioned_route(path, view_func, methods=['GET']):
    """
    Register a route for both /api/ and /api/v1/ prefixes
    This maintains backward compatibility while supporting versioning
    """
    # Original route already registered with @app.route
    # Add v1 alias
    v1_path = path.replace('/api/', '/api/v1/')
    app.add_url_rule(v1_path, f"{view_func.__name__}_v1", view_func, methods=methods)

@app.route('/api/version', methods=['GET'])
@limiter.limit("100 per minute")
def api_version():
    """Get API version info"""
    return jsonify({
        "version": "1.0.0",
        "api_version": "v1",
        "endpoints": {
            "docs": "/api/docs",
            "health": "/api/health",
            "auth": {
                "register": "/api/auth/register",
                "login": "/api/auth/login"
            },
            "game": {
                "new": "/api/game/new",
                "state": "/api/game/<session_id>/state",
                "decisions": "/api/game/<session_id>/decisions",
                "execute": "/api/game/<session_id>/execute",
                "save": "/api/game/save",
                "load": "/api/game/load/<session_id>",
                "history": "/api/game/<session_id>/history"
            },
            "stats": {
                "global": "/api/stats/global",
                "leaderboard": "/api/leaderboard"
            }
        },
        "features": {
            "rate_limiting": True,
            "compression": True,
            "jwt_auth": SCHEMAS_ENABLED,
            "schema_validation": SCHEMAS_ENABLED,
            "database": DB_ENABLED,
            "cors": True,
            "swagger_docs": True
        }
    })

# Global game state storage (in production, use Redis or database)
games = {}

class GameSession:
    def __init__(self, session_id):
        self.session_id = session_id
        self.security = SecuritySystem()
        self.decision_manager = SOCDecisionManager()
        self.event_manager = CyberEventManager()
        self.turn = 1
        self.max_turns = 30
        self.game_over = False
        self.victory = False
        data_dir = os.getenv("GAME_DATA_DIR")
        if not data_dir:
            # Vercel functions can write only under /tmp.
            data_dir = os.path.join(tempfile.gettempdir(), "simulador_data") if os.getenv("VERCEL") else "data"
        self.data_file = os.path.join(data_dir, f"soc_data_{session_id}.csv")
        self.setup_data_file()
    
    def setup_data_file(self):
        """Create CSV file for this session"""
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        with open(self.data_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([
                "timestamp", "turn", "decision", "decision_category", "decision_cost",
                "security_score", "budget", "reputation", "servers_infected",
                "alerts_queue", "active_threats", "incidents_resolved",
                "blocked_attacks", "successful_breaches", "mttd", "mttr",
                "event_name", "event_severity", "mitre_tactic", "mitre_technique"
            ])
    
    def save_turn_data(self, decision, event=None):
        """Save turn data"""
        with open(self.data_file, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            
            event_name = event["name"] if event else ""
            event_severity = event["severity"] if event else ""
            mitre_tactic = event["mitre"]["tactic"] if event else ""
            mitre_technique = event["mitre"]["technique"] if event else ""
            
            writer.writerow([
                datetime.now().isoformat(),
                self.turn,
                decision.get("name", "Unknown"),
                decision.get("category", "unknown"),
                decision.get("cost", 0),
                self.security.security_score,
                self.security.budget,
                self.security.reputation,
                self.security.servers_infected,
                self.security.alerts_queue,
                self.security.active_threats,
                self.security.incidents_resolved,
                self.security.blocked_attacks,
                self.security.successful_breaches,
                self.security.mean_time_to_detect,
                self.security.mean_time_to_respond,
                event_name,
                event_severity,
                mitre_tactic,
                mitre_technique
            ])
    
    def get_state(self):
        """Get current game state as dict"""
        team_capacity = self.security.analysts_l1 + (self.security.analysts_l2 * 2) + (self.security.threat_hunters * 3)
        
        return {
            "turn": self.turn,
            "maxTurns": self.max_turns,
            "gameOver": self.game_over,
            "victory": self.victory,
            "securityScore": self.security.security_score,
            "budget": self.security.budget,
            "reputation": self.security.reputation,
            "incomePerTurn": self.security.income_per_turn,  # NUEVO: Para mostrar al usuario
            "serversInfected": self.security.servers_infected,
            "totalServers": self.security.total_servers,
            "endpointsProtected": self.security.endpoints_protected,
            "activeThreats": self.security.active_threats,
            "alertsQueue": self.security.alerts_queue,
            "incidentsResolved": self.security.incidents_resolved,
            "attacksBlocked": self.security.blocked_attacks,
            "successfulBreaches": self.security.successful_breaches,
            "mttd": self.security.mean_time_to_detect,
            "mttr": self.security.mean_time_to_respond,
            "iocDatabase": self.security.ioc_database,
            "mitreKnown": self.security.mitre_techniques_known,
            "analystsL1": self.security.analysts_l1,
            "analystsL2": self.security.analysts_l2,
            "threatHunters": self.security.threat_hunters,
            "teamCapacity": team_capacity,
            "tools": self.security.tools
        }
    
    def check_game_over(self):
        """Check game over conditions"""
        conditions = self.security.check_game_over()
        if conditions:
            self.game_over = True
            return True, conditions
        return False, []
    
    def check_victory(self):
        """Check victory conditions"""
        if self.turn > self.max_turns:
            self.victory = True
            return True
        return False


# ============================================================
# AUTHENTICATION ENDPOINTS (JWT)
# ============================================================

@app.route('/api/auth/register', methods=['POST'])
@limiter.limit("5 per minute")  # Prevent brute force registration
def register_user():
    """
    Register a new user and return JWT token
    POST /api/auth/register
    Body: {"username": "...", "password": "...", "email": "..."}
    """
    if not SCHEMAS_ENABLED:
        return jsonify({
            'success': False,
            'error': 'Authentication not available'
        }), 503
    
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        
        # Validate
        if not username or not password:
            return jsonify({
                'success': False,
                'error': 'Username and password required'
            }), 400
        
        if len(username) < 3:
            return jsonify({
                'success': False,
                'error': 'Username must be at least 3 characters'
            }), 400
        
        if len(password) < 6:
            return jsonify({
                'success': False,
                'error': 'Password must be at least 6 characters'
            }), 400
        
        # Create user
        user = create_user(username, password, email)
        if not user:
            return jsonify({
                'success': False,
                'error': 'Username already taken'
            }), 400
        
        # Generate JWT token
        token = generate_token(user['id'], user['username'])
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username']
            },
            'message': 'User registered successfully'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/auth/login', methods=['POST'])
@limiter.limit("10 per minute")  # Prevent brute force login
def login_user():
    """
    Login user and return JWT token
    POST /api/auth/login
    Body: {"username": "...", "password": "..."}
    """
    if not SCHEMAS_ENABLED:
        return jsonify({
            'success': False,
            'error': 'Authentication not available'
        }), 503
    
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({
                'success': False,
                'error': 'Username and password required'
            }), 400
        
        # Authenticate
        user = authenticate_user(username, password)
        if not user:
            return jsonify({
                'success': False,
                'error': 'Invalid credentials'
            }), 401
        
        # Generate JWT token
        token = generate_token(user['id'], user['username'])
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username']
            },
            'message': 'Login successful'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# ============================================================
# GAME ENDPOINTS
# ============================================================

@app.route('/api/game/new', methods=['POST'])
@limiter.limit("30 per minute")  # Rate limit game creation
def new_game():
    """Start a new game session"""
    session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{random.randint(1000, 9999)}"
    game = GameSession(session_id)
    games[session_id] = game
    
    # Save to database
    if DB_ENABLED:
        try:
            db_game = db_service.create_game(session_id)
            db_service.save_game_state(db_game.id, game.turn, game.get_state())
        except Exception as e:
            print(f"⚠️ DB save error: {e}")
    
    return jsonify({
        "success": True,
        "sessionId": session_id,
        "state": game.get_state()
    })

@app.route('/api/game/<session_id>/state', methods=['GET'])
@limiter.limit("100 per minute")
def get_state(session_id):
    """Get current game state"""
    if session_id not in games:
        return jsonify({"success": False, "error": "Session not found"}), 404
    
    game = games[session_id]
    return jsonify({
        "success": True,
        "state": game.get_state()
    })

@app.route('/api/game/<session_id>/decisions', methods=['GET'])
@limiter.limit("100 per minute")
def get_decisions(session_id):
    """Get all available decisions"""
    if session_id not in games:
        return jsonify({"success": False, "error": "Session not found"}), 404
    
    game = games[session_id]
    category = request.args.get('category', None)
    
    if category:
        decisions = game.decision_manager.get_decisions_by_category(category)
    else:
        decisions = game.decision_manager.get_all_decisions()
    
    # Add executability info
    for decision in decisions:
        can_execute, msg = game.decision_manager.can_execute_decision(decision, game.security)
        decision['canExecute'] = can_execute
        decision['reason'] = msg if not can_execute else ""
    
    return jsonify({
        "success": True,
        "decisions": decisions
    })

@app.route('/api/game/<session_id>/execute', methods=['POST'])
@limiter.limit("60 per minute")  # Rate limit decision execution
def execute_decision(session_id):
    """Execute a decision and advance turn"""
    if session_id not in games:
        return jsonify({"success": False, "error": "Session not found"}), 404
    
    game = games[session_id]
    data = request.json
    decision_id = data.get('decisionId')
    
    # Find decision
    all_decisions = game.decision_manager.get_all_decisions()
    decision = next((d for d in all_decisions if d['id'] == decision_id), None)
    
    if not decision:
        return jsonify({"success": False, "error": "Invalid decision"}), 400
    
    # Process alerts with team first
    processed_alerts = game.security.process_alerts()
    
    # Execute decision
    success, message = game.decision_manager.execute_decision(decision, game.security)
    
    if not success:
        return jsonify({"success": False, "error": message}), 400
    
    # Trigger random event (70% chance)
    event = None
    event_message = None
    if random.random() > 0.3:
        event = game.event_manager.get_random_event()
        if event:
            if "effects" in event:
                game.security.update_metrics(**event["effects"])
            event_message = {
                "name": event["name"],
                "description": event["description"],
                "severity": event["severity"],
                "mitre": event["mitre"]
            }
    
    # Save to database
    if DB_ENABLED:
        try:
            db_game = db_service.get_game_by_session(session_id)
            if db_game:
                # Log decision
                db_service.log_decision(db_game.id, game.turn, decision)
                
                # Log event if one occurred
                if event:
                    db_service.log_event(db_game.id, game.turn, event)
                
                # Save game state after turn
                db_service.save_game_state(db_game.id, game.turn, game.get_state())
        except Exception as e:
            print(f"⚠️ DB save error during execute: {e}")
    
    # Save turn data
    game.save_turn_data(decision, event)
    
    # Advance turn
    game.turn += 1
    
    # NUEVO: Ingresos pasivos cada turno (presupuesto mensual)
    income = game.security.income_per_turn
    game.security.budget += income
    income_message = f"💰 Presupuesto mensual recibido: +${income:,}"
    
    # Check conditions
    game_over, game_over_reasons = game.check_game_over()
    victory = game.check_victory()
    
    return jsonify({
        "success": True,
        "message": message,
        "income": income,
        "incomeMessage": income_message,
        "processedAlerts": processed_alerts,
        "event": event_message,
        "gameOver": game_over,
        "gameOverReasons": game_over_reasons,
        "victory": victory,
        "state": game.get_state()
    })

@app.route('/api/game/<session_id>/categories', methods=['GET'])
def get_categories(session_id):
    """Get decision categories"""
    return jsonify({
        "success": True,
        "categories": [
            {"id": "investigate", "name": "🔍 Investigation", "description": "Analyze logs and investigate incidents"},
            {"id": "respond", "name": "🚨 Response", "description": "Respond to active threats"},
            {"id": "upgrade", "name": "⬆️ Upgrade", "description": "Deploy new security tools"},
            {"id": "team", "name": "👥 Team", "description": "Manage SOC team"},
            {"id": "proactive", "name": "🎯 Proactive", "description": "Proactive security actions"}
        ]
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Cyber Defense Simulator API",
        "version": "1.0.0",
        "database": "enabled" if DB_ENABLED else "disabled"
    })


@app.route('/api/analytics', methods=['POST'])
@limiter.limit("300 per minute")
def analytics_ingest():
    """Ingest frontend performance metrics without breaking UX."""
    try:
        payload = request.get_json(silent=True)
        if payload is None and request.data:
            # Beacon API may send plain JSON bytes without content-type header.
            payload = json.loads(request.data.decode('utf-8'))
    except Exception:
        payload = None

    return jsonify({
        "success": True,
        "received": bool(payload)
    }), 202

# ============= NEW DATABASE ENDPOINTS =============

@app.route('/api/game/save', methods=['POST'])
def save_game():
    """Save current game state to database"""
    if not DB_ENABLED:
        return jsonify({"success": False, "error": "Database not enabled"}), 503
    
    data = request.json
    session_id = data.get('sessionId')
    
    if not session_id or session_id not in games:
        return jsonify({"success": False, "error": "Invalid session"}), 400
    
    try:
        game = games[session_id]
        db_game = db_service.get_game_by_session(session_id)
        
        if db_game:
            # Save current state
            db_service.save_game_state(db_game.id, game.turn, game.get_state())
            
            # If game is over, update final stats
            if game.game_over or game.victory:
                db_service.end_game(session_id, game.get_state())
            
            return jsonify({
                "success": True,
                "message": "Game saved successfully",
                "turn": game.turn
            })
        else:
            return jsonify({"success": False, "error": "Game not found in database"}), 404
            
    except Exception as e:
        print(f"Error saving game: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/game/load/<session_id>', methods=['GET'])
@limiter.limit("20 per minute")
def load_game(session_id):
    """Load a saved game state from database"""
    if not DB_ENABLED:
        return jsonify({"success": False, "error": "Database not enabled"}), 503
    
    try:
        state = db_service.get_latest_game_state(session_id)
        
        if state:
            return jsonify({
                "success": True,
                "sessionId": session_id,
                "state": state
            })
        else:
            return jsonify({"success": False, "error": "Saved game not found"}), 404
            
    except Exception as e:
        print(f"Error loading game: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/leaderboard', methods=['GET'])
@limiter.limit("30 per minute")
def get_leaderboard():
    """Get top players leaderboard"""
    if not DB_ENABLED:
        return jsonify({"success": False, "error": "Database not enabled"}), 503
    
    try:
        limit = request.args.get('limit', 100, type=int)
        leaderboard = db_service.get_leaderboard(limit)
        
        result = []
        for entry in leaderboard:
            result.append({
                "rank": len(result) + 1,
                "username": entry.username,
                "totalScore": entry.total_score,
                "gamesPlayed": entry.games_played,
                "gamesWon": entry.games_won,
                "avgScore": round(entry.avg_score, 2),
                "bestScore": entry.best_score,
                "winRate": round((entry.games_won / entry.games_played * 100) if entry.games_played > 0 else 0, 1),
                "lastUpdated": entry.last_updated.isoformat() if entry.last_updated else None
            })
        
        return jsonify({
            "success": True,
            "leaderboard": result
        })
        
    except Exception as e:
        print(f"Error getting leaderboard: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/stats/global', methods=['GET'])
@limiter.limit("50 per minute")
def get_global_stats():
    """Get global game statistics"""
    if not DB_ENABLED:
        return jsonify({"success": False, "error": "Database not enabled"}), 503
    
    try:
        stats = db_service.get_global_stats()
        
        return jsonify({
            "success": True,
            "stats": stats
        })
        
    except Exception as e:
        print(f"Error getting stats: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/game/<session_id>/history', methods=['GET'])
@limiter.limit("30 per minute")
def get_game_history(session_id):
    """Get decision and event history for a game"""
    if not DB_ENABLED:
        return jsonify({"success": False, "error": "Database not enabled"}), 503
    
    try:
        db_game = db_service.get_game_by_session(session_id)
        
        if not db_game:
            return jsonify({"success": False, "error": "Game not found"}), 404
        
        decisions = db_service.get_game_decisions(db_game.id)
        events = db_service.get_game_events(db_game.id)
        stats = db_service.get_decision_stats(db_game.id)
        
        return jsonify({
            "success": True,
            "decisions": [{
                "turn": d.turn,
                "name": d.decision_name,
                "category": d.category,
                "cost": d.cost,
                "timestamp": d.created_at.isoformat()
            } for d in decisions],
            "events": [{
                "turn": e.turn,
                "name": e.event_name,
                "type": e.event_type,
                "severity": e.severity,
                "timestamp": e.created_at.isoformat()
            } for e in events],
            "stats": stats
        })
        
    except Exception as e:
        print(f"Error getting history: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

# ============= END NEW ENDPOINTS =============

@app.route('/')
def index():
    """Serve main page"""
    return app.send_static_file('soc-dashboard.html')


# ============= API Versioning - Register v1 aliases =============
# Register all endpoints under /api/v1/ for version compatibility
# This allows clients to use either /api/ or /api/v1/

# Auth endpoints
app.add_url_rule('/api/v1/auth/register', 'register_user_v1', register_user, methods=['POST'])
app.add_url_rule('/api/v1/auth/login', 'login_user_v1', login_user, methods=['POST'])

# Game endpoints
app.add_url_rule('/api/v1/game/new', 'new_game_v1', new_game, methods=['POST'])
app.add_url_rule('/api/v1/game/<session_id>/state', 'get_state_v1', get_state, methods=['GET'])
app.add_url_rule('/api/v1/game/<session_id>/decisions', 'get_decisions_v1', get_decisions, methods=['GET'])
app.add_url_rule('/api/v1/game/<session_id>/execute', 'execute_decision_v1', execute_decision, methods=['POST'])
app.add_url_rule('/api/v1/game/<session_id>/categories', 'get_categories_v1', get_categories, methods=['GET'])
app.add_url_rule('/api/v1/game/save', 'save_game_v1', save_game, methods=['POST'])
app.add_url_rule('/api/v1/game/load/<session_id>', 'load_game_v1', load_game, methods=['GET'])
app.add_url_rule('/api/v1/game/<session_id>/history', 'get_game_history_v1', get_game_history, methods=['GET'])

# Stats endpoints
app.add_url_rule('/api/v1/leaderboard', 'get_leaderboard_v1', get_leaderboard, methods=['GET'])
app.add_url_rule('/api/v1/stats/global', 'get_global_stats_v1', get_global_stats, methods=['GET'])

# System endpoints
app.add_url_rule('/api/v1/health', 'health_v1', health, methods=['GET'])
app.add_url_rule('/api/v1/version', 'api_version_v1', api_version, methods=['GET'])
app.add_url_rule('/api/v1/analytics', 'analytics_ingest_v1', analytics_ingest, methods=['POST'])

print("✅ API versioning configured: /api/ and /api/v1/ available")


# ============= Static Files Serving =============
# Catch-all route for serving static files (must be last)
# This handles HTML files and other static assets
@app.route('/<path:filename>')
def serve_static_file(filename):
    """Serve static files from public directory"""
    try:
        return send_from_directory(app.static_folder, filename)
    except:
        # If file not found, return 404
        return jsonify({"error": "File not found"}), 404


if __name__ == '__main__':
    # Development server
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
