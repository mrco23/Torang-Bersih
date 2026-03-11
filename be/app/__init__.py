"""Flask application factory"""
import os
from flask import Flask, jsonify, send_from_directory

from app.config.environment import get_config
from app.config.extensions import db, migrate, jwt, mail, cors, limiter
from app.config.utilities_setup import register_error_handlers, register_jwt_callbacks, register_request_logger


def create_app(config_class=None):
    app = Flask(__name__)
    
    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)
    
    _init_extensions(app)
    _register_blueprints(app)
    
    register_error_handlers(app)
    register_jwt_callbacks(app, jwt)
    register_request_logger(app)

    @app.route('/') #html page
    def index():
        docs_dir = os.path.join(app.root_path, '..', 'docs')
        return send_from_directory(docs_dir, 'API.html')

    @app.route('/health')
    def health():
        return jsonify({'success': True, 'message': 'OK'}), 200
    
    return app


def _init_extensions(app):
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    limiter.init_app(app)
    
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": app.config.get('CORS_ORIGINS', ['*']),
            "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
            "supports_credentials": True
        }
    })
    
    # Cloudinary
    from app.lib.cloudinary import init_cloudinary
    with app.app_context():
        init_cloudinary()


def _register_blueprints(app):
    from app.api.routes import register_routes
    register_routes(app)

