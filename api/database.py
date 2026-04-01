"""
Database configuration and models for Cyber Defense Simulator
Using SQLAlchemy with SQLite for local storage
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# Database setup
default_sqlite_url = 'sqlite:////tmp/game_data.db' if os.getenv('VERCEL') else 'sqlite:///./game_data.db'
DATABASE_URL = os.getenv('DATABASE_URL', default_sqlite_url)

engine_kwargs = {}
if DATABASE_URL.startswith('sqlite'):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    games = relationship("Game", back_populates="user")
    achievements = relationship("Achievement", back_populates="user")


class Game(Base):
    __tablename__ = 'games'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True, index=True)
    session_id = Column(String(100), unique=True, nullable=False, index=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    final_score = Column(Integer, nullable=True)
    final_budget = Column(Integer, nullable=True)
    final_security_score = Column(Integer, nullable=True)
    final_reputation = Column(Integer, nullable=True)
    turns_completed = Column(Integer, default=0)
    won = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="games")
    game_states = relationship("GameState", back_populates="game", cascade="all, delete-orphan")
    decisions = relationship("Decision", back_populates="game", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="game", cascade="all, delete-orphan")


class GameState(Base):
    __tablename__ = 'game_states'
    
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey('games.id'), nullable=False, index=True)
    turn = Column(Integer, nullable=False, index=True)
    state_json = Column(Text, nullable=False)  # JSON string of full game state
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    game = relationship("Game", back_populates="game_states")


class Decision(Base):
    __tablename__ = 'decisions'
    
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey('games.id'), nullable=False, index=True)
    turn = Column(Integer, nullable=False, index=True)
    decision_id = Column(String(100), nullable=False)
    decision_name = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False, index=True)
    cost = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    game = relationship("Game", back_populates="decisions")


class Event(Base):
    __tablename__ = 'events'
    
    id = Column(Integer, primary_key=True, index=True)
    game_id = Column(Integer, ForeignKey('games.id'), nullable=False, index=True)
    turn = Column(Integer, nullable=False, index=True)
    event_name = Column(String(200), nullable=False)
    event_type = Column(String(50), nullable=False, index=True)
    severity = Column(String(20), nullable=False, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    game = relationship("Game", back_populates="events")


class Achievement(Base):
    __tablename__ = 'achievements'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True, index=True)
    game_id = Column(Integer, nullable=True, index=True)
    achievement_type = Column(String(100), nullable=False, index=True)
    achievement_name = Column(String(200), nullable=False)
    unlocked_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="achievements")


class Leaderboard(Base):
    __tablename__ = 'leaderboard'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True, index=True)
    username = Column(String(50), nullable=False)
    total_score = Column(Integer, default=0, index=True)
    games_played = Column(Integer, default=0)
    games_won = Column(Integer, default=0)
    avg_score = Column(Float, default=0.0)
    best_score = Column(Integer, default=0)
    total_turns = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Database initialization
def init_db():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized successfully")


def get_db():
    """Dependency for getting DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Utility functions
def create_indexes():
    """Create additional indexes for optimization"""
    from sqlalchemy import Index
    
    # Composite indexes for common queries
    Index('idx_games_user_created', Game.user_id, Game.started_at)
    Index('idx_decisions_game_turn', Decision.game_id, Decision.turn)
    Index('idx_events_game_turn', Event.game_id, Event.turn)
    Index('idx_leaderboard_score', Leaderboard.total_score.desc())
    
    print("✅ Indexes created successfully")


if __name__ == "__main__":
    print("🗄️ Initializing database...")
    init_db()
    create_indexes()
    print("🎉 Database setup complete!")
