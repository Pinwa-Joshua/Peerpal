from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .database import db, migrate
from flask_jwt_extended import JWTManager
from app.models import RevokedToken
from .scheduler import start_scheduler

jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    from flask_cors import CORS

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register blueprints...
    from .routes.users import users_bp
    app.register_blueprint(users_bp, url_prefix="/api/users")
    # (other blueprints)

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload.get("jti")
        if not jti:
            return True
        return RevokedToken.query.filter_by(jti=jti).first() is not None

    @app.route('/')
    def home():
        return "Online!", 200

    # Maintenance mode
    @app.before_request
    def maintenance():
        if app.config.get("MAINTENANCE_MODE"):
            return jsonify({"message": "Platform under maintenance"}), 503

    # Start scheduler and pass the app
    start_scheduler(app)

    return app