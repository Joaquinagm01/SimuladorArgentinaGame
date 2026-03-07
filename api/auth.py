"""
JWT Authentication utilities
"""

import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify

# JWT configuration
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24


def generate_token(user_id, username):
    """Generate JWT token for user"""
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token


def decode_token(token):
    """Decode and verify JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def token_required(optional=False):
    """Decorator to require JWT token for endpoints"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = None
            
            # Get token from Authorization header
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
            
            # If no token and not optional, return error
            if not token:
                if optional:
                    request.current_user = None
                    return f(*args, **kwargs)
                else:
                    return jsonify({
                        'success': False,
                        'error': 'Token required',
                        'message': 'Please provide a valid JWT token in Authorization header'
                    }), 401
            
            # Verify token
            payload = decode_token(token)
            if not payload:
                if optional:
                    request.current_user = None
                    return f(*args, **kwargs)
                else:
                    return jsonify({
                        'success': False,
                        'error': 'Invalid token',
                        'message': 'Token is invalid or expired'
                    }), 401
            
            # Store user info in request context
            request.current_user = {
                'user_id': payload.get('user_id'),
                'username': payload.get('username')
            }
            
            return f(*args, **kwargs)
        
        return wrapper
    return decorator


# Simple in-memory user storage (replace with database in production)
USERS = {}


def create_user(username, password, email=None):
    """Create a new user (simplified - use proper password hashing in production)"""
    if username in USERS:
        return None
    
    user_id = len(USERS) + 1
    USERS[username] = {
        'id': user_id,
        'username': username,
        'password': password,  # In production: use bcrypt or argon2
        'email': email,
        'created_at': datetime.utcnow().isoformat()
    }
    return USERS[username]


def authenticate_user(username, password):
    """Authenticate user credentials"""
    user = USERS.get(username)
    if user and user['password'] == password:  # In production: compare hashed passwords
        return user
    return None
