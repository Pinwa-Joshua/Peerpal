from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .database import db, migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from app.models import RevokedToken
from .scheduler import start_scheduler

jwt = JWTManager()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    from flask_cors import CORS

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)

    # Register blueprints...
    from .routes.users import users_bp
    from .routes.tutors import tutors_bp
    from .routes.admin import admin_bp
    from .routes.matches import matches_bp
    from .routes.sessions import sessions_bp
    from .routes.feedback import feedback_bp
    from .routes.messages import messages_bp
    from .routes.notifications import notifications_bp
    from .routes.progress import progress_bp
    from .routes.quiz import quiz_bp
    from .routes.predict import predict_bp
    from .routes.ml_data import ml_data_bp
    
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(tutors_bp, url_prefix="/api/tutors")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(matches_bp, url_prefix="/api/matches")
    app.register_blueprint(sessions_bp, url_prefix="/api/sessions")
    app.register_blueprint(feedback_bp, url_prefix="/api/feedback")
    app.register_blueprint(messages_bp, url_prefix="/api/messages")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")
    app.register_blueprint(progress_bp, url_prefix="/api/progress")
    app.register_blueprint(quiz_bp, url_prefix="/api/quiz")
    app.register_blueprint(predict_bp, url_prefix="/api/predict")
    app.register_blueprint(ml_data_bp, url_prefix="/api/ml-data")

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