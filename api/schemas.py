"""
Marshmallow schemas for API request/response validation
"""

from marshmallow import Schema, fields, validate, ValidationError
from flask import request, jsonify


class ExecuteDecisionSchema(Schema):
    """Schema for executing a decision"""
    decisionId = fields.Str(required=True, validate=validate.Length(min=1, max=100))


class SaveGameSchema(Schema):
    """Schema for saving a game"""
    sessionId = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    state = fields.Dict(required=True)


class DecisionCategorySchema(Schema):
    """Schema for filtering decisions by category"""
    category = fields.Str(validate=validate.OneOf([
        'investigate', 'respond', 'upgrade', 'team', 'proactive'
    ]))


class LeaderboardSchema(Schema):
    """Schema for leaderboard request"""
    limit = fields.Int(
        load_default=100,
        validate=validate.Range(min=1, max=500)
    )


class GameStateSchema(Schema):
    """Schema for full game state"""
    turn = fields.Int(required=True)
    maxTurns = fields.Int(required=True)
    gameOver = fields.Bool(required=True)
    victory = fields.Bool(required=True)
    securityScore = fields.Int(required=True)
    budget = fields.Int(required=True)
    reputation = fields.Int(required=True)
    incomePerTurn = fields.Int(required=True)
    serversInfected = fields.Int(required=True)
    totalServers = fields.Int(required=True)
    endpointsProtected = fields.Int(required=True)
    activeThreats = fields.Int(required=True)
    alertsQueue = fields.Int(required=True)
    incidentsResolved = fields.Int(required=True)
    attacksBlocked = fields.Int(required=True)
    successfulBreaches = fields.Int(required=True)
    mttd = fields.Float(required=True)
    mttr = fields.Float(required=True)
    iocDatabase = fields.Int(required=True)
    mitreKnown = fields.Int(required=True)
    analystsL1 = fields.Int(required=True)
    analystsL2 = fields.Int(required=True)
    threatHunters = fields.Int(required=True)
    teamCapacity = fields.Int(required=True)
    tools = fields.Dict(required=True)


class UserRegistrationSchema(Schema):
    """Schema for user registration (JWT)"""
    username = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=50)
    )
    password = fields.Str(
        required=True,
        validate=validate.Length(min=6, max=100)
    )
    email = fields.Email(required=False)


class UserLoginSchema(Schema):
    """Schema for user login (JWT)"""
    username = fields.Str(required=True)
    password = fields.Str(required=True)


def validate_request(schema_class):
    """Decorator to validate request data against schema"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            schema = schema_class()
            try:
                # Validate query params for GET, body for POST
                if request.method == 'GET':
                    data = schema.load(request.args)
                else:
                    data = schema.load(request.get_json() or {})
                
                # Store validated data in request context
                request.validated_data = data
                return f(*args, **kwargs)
            
            except ValidationError as err:
                return jsonify({
                    'success': False,
                    'error': 'Validation error',
                    'details': err.messages
                }), 400
        
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator
