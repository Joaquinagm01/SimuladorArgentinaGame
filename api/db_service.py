"""
Database service layer with CRUD operations and business logic
"""

from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from datetime import datetime
import json
from typing import Optional, List, Dict, Any

from database import (
    User, Game, GameState, Decision, Event, Achievement, Leaderboard,
    SessionLocal
)


class DatabaseService:
    """Service for database operations"""
    
    def __init__(self):
        self.db = SessionLocal()
    
    def close(self):
        self.db.close()
    
    # ============= USER OPERATIONS =============
    
    def create_user(self, username: str, email: Optional[str] = None) -> User:
        """Create a new user"""
        user = User(username=username, email=email)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        return self.db.query(User).filter(User.username == username).first()
    
    def get_or_create_user(self, username: str) -> User:
        """Get existing user or create new one"""
        user = self.get_user_by_username(username)
        if not user:
            user = self.create_user(username)
        return user
    
    # ============= GAME OPERATIONS =============
    
    def create_game(self, session_id: str, user_id: Optional[int] = None) -> Game:
        """Create a new game"""
        game = Game(session_id=session_id, user_id=user_id)
        self.db.add(game)
        self.db.commit()
        self.db.refresh(game)
        return game
    
    def get_game_by_session(self, session_id: str) -> Optional[Game]:
        """Get game by session ID"""
        return self.db.query(Game).filter(Game.session_id == session_id).first()
    
    def end_game(self, session_id: str, final_state: Dict[str, Any]) -> Game:
        """Mark game as ended and save final stats"""
        game = self.get_game_by_session(session_id)
        if game:
            game.ended_at = datetime.utcnow()
            game.final_score = final_state.get('securityScore', 0)
            game.final_budget = final_state.get('budget', 0)
            game.final_security_score = final_state.get('securityScore', 0)
            game.final_reputation = final_state.get('reputation', 0)
            game.turns_completed = final_state.get('turn', 0)
            game.won = final_state.get('won', False)
            self.db.commit()
            self.db.refresh(game)
            
            # Update leaderboard
            if game.user_id:
                self._update_leaderboard(game)
        
        return game
    
    def get_user_games(self, user_id: int, limit: int = 10) -> List[Game]:
        """Get user's recent games"""
        return self.db.query(Game)\
            .filter(Game.user_id == user_id)\
            .order_by(desc(Game.started_at))\
            .limit(limit)\
            .all()
    
    # ============= GAME STATE OPERATIONS =============
    
    def save_game_state(self, game_id: int, turn: int, state_dict: Dict[str, Any]) -> GameState:
        """Save a game state snapshot"""
        state_json = json.dumps(state_dict)
        game_state = GameState(
            game_id=game_id,
            turn=turn,
            state_json=state_json
        )
        self.db.add(game_state)
        self.db.commit()
        self.db.refresh(game_state)
        return game_state
    
    def get_game_state(self, game_id: int, turn: int) -> Optional[Dict[str, Any]]:
        """Get game state for specific turn"""
        state = self.db.query(GameState)\
            .filter(GameState.game_id == game_id, GameState.turn == turn)\
            .first()
        
        if state:
            return json.loads(state.state_json)
        return None
    
    def get_latest_game_state(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get the most recent saved state for a session"""
        game = self.get_game_by_session(session_id)
        if not game:
            return None
        
        state = self.db.query(GameState)\
            .filter(GameState.game_id == game.id)\
            .order_by(desc(GameState.turn))\
            .first()
        
        if state:
            return json.loads(state.state_json)
        return None
    
    # ============= DECISION OPERATIONS =============
    
    def log_decision(self, game_id: int, turn: int, decision_data: Dict[str, Any]) -> Decision:
        """Log a decision made in the game"""
        decision = Decision(
            game_id=game_id,
            turn=turn,
            decision_id=decision_data.get('id', ''),
            decision_name=decision_data.get('name', ''),
            category=decision_data.get('category', ''),
            cost=decision_data.get('cost', 0)
        )
        self.db.add(decision)
        self.db.commit()
        self.db.refresh(decision)
        return decision
    
    def get_game_decisions(self, game_id: int) -> List[Decision]:
        """Get all decisions for a game"""
        return self.db.query(Decision)\
            .filter(Decision.game_id == game_id)\
            .order_by(Decision.turn)\
            .all()
    
    def get_decision_stats(self, game_id: int) -> Dict[str, Any]:
        """Get statistics about decisions made in a game"""
        decisions = self.get_game_decisions(game_id)
        
        total_cost = sum(d.cost for d in decisions)
        by_category = {}
        
        for decision in decisions:
            if decision.category not in by_category:
                by_category[decision.category] = {
                    'count': 0,
                    'total_cost': 0
                }
            by_category[decision.category]['count'] += 1
            by_category[decision.category]['total_cost'] += decision.cost
        
        return {
            'total_decisions': len(decisions),
            'total_cost': total_cost,
            'by_category': by_category
        }
    
    # ============= EVENT OPERATIONS =============
    
    def log_event(self, game_id: int, turn: int, event_data: Dict[str, Any]) -> Event:
        """Log a game event"""
        event = Event(
            game_id=game_id,
            turn=turn,
            event_name=event_data.get('name', ''),
            event_type=event_data.get('type', ''),
            severity=event_data.get('severity', 'info'),
            description=event_data.get('description', '')
        )
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event
    
    def get_game_events(self, game_id: int) -> List[Event]:
        """Get all events for a game"""
        return self.db.query(Event)\
            .filter(Event.game_id == game_id)\
            .order_by(Event.turn)\
            .all()
    
    # ============= ACHIEVEMENT OPERATIONS =============
    
    def unlock_achievement(self, user_id: int, game_id: int, 
                          achievement_type: str, achievement_name: str) -> Achievement:
        """Unlock an achievement for a user"""
        # Check if already unlocked
        existing = self.db.query(Achievement)\
            .filter(
                Achievement.user_id == user_id,
                Achievement.achievement_type == achievement_type
            ).first()
        
        if existing:
            return existing
        
        achievement = Achievement(
            user_id=user_id,
            game_id=game_id,
            achievement_type=achievement_type,
            achievement_name=achievement_name
        )
        self.db.add(achievement)
        self.db.commit()
        self.db.refresh(achievement)
        return achievement
    
    def get_user_achievements(self, user_id: int) -> List[Achievement]:
        """Get all achievements for a user"""
        return self.db.query(Achievement)\
            .filter(Achievement.user_id == user_id)\
            .order_by(desc(Achievement.unlocked_at))\
            .all()
    
    # ============= LEADERBOARD OPERATIONS =============
    
    def _update_leaderboard(self, game: Game):
        """Update leaderboard after game ends"""
        leaderboard = self.db.query(Leaderboard)\
            .filter(Leaderboard.user_id == game.user_id)\
            .first()
        
        if not leaderboard:
            user = self.db.query(User).filter(User.id == game.user_id).first()
            leaderboard = Leaderboard(
                user_id=game.user_id,
                username=user.username if user else "Unknown"
            )
            self.db.add(leaderboard)
        
        # Update stats
        leaderboard.games_played += 1
        if game.won:
            leaderboard.games_won += 1
        
        leaderboard.total_score += game.final_score or 0
        leaderboard.total_turns += game.turns_completed or 0
        
        if game.final_score and game.final_score > leaderboard.best_score:
            leaderboard.best_score = game.final_score
        
        # Calculate average
        if leaderboard.games_played > 0:
            leaderboard.avg_score = leaderboard.total_score / leaderboard.games_played
        
        leaderboard.last_updated = datetime.utcnow()
        
        self.db.commit()
    
    def get_leaderboard(self, limit: int = 100) -> List[Leaderboard]:
        """Get top players from leaderboard"""
        return self.db.query(Leaderboard)\
            .order_by(desc(Leaderboard.total_score))\
            .limit(limit)\
            .all()
    
    def get_user_rank(self, user_id: int) -> Optional[int]:
        """Get user's rank on leaderboard"""
        leaderboard = self.db.query(Leaderboard)\
            .filter(Leaderboard.user_id == user_id)\
            .first()
        
        if not leaderboard:
            return None
        
        rank = self.db.query(func.count(Leaderboard.id))\
            .filter(Leaderboard.total_score > leaderboard.total_score)\
            .scalar()
        
        return rank + 1
    
    # ============= ANALYTICS =============
    
    def get_global_stats(self) -> Dict[str, Any]:
        """Get global game statistics"""
        total_games = self.db.query(func.count(Game.id)).scalar()
        total_users = self.db.query(func.count(User.id)).scalar()
        completed_games = self.db.query(func.count(Game.id))\
            .filter(Game.ended_at.isnot(None))\
            .scalar()
        won_games = self.db.query(func.count(Game.id))\
            .filter(Game.won == True)\
            .scalar()
        
        avg_turns = self.db.query(func.avg(Game.turns_completed))\
            .filter(Game.ended_at.isnot(None))\
            .scalar() or 0
        
        return {
            'total_games': total_games,
            'total_users': total_users,
            'completed_games': completed_games,
            'won_games': won_games,
            'win_rate': (won_games / completed_games * 100) if completed_games > 0 else 0,
            'avg_turns_completed': round(avg_turns, 2)
        }


# Singleton instance
_db_service = None

def get_db_service() -> DatabaseService:
    """Get or create database service singleton"""
    global _db_service
    if _db_service is None:
        _db_service = DatabaseService()
    return _db_service
