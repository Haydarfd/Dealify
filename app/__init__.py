from flask import Flask, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, current_user
from flask_mail import Mail
from flask_cors import CORS
import os
import stripe

# Initialize extensions
db = SQLAlchemy()
login_manager = LoginManager()
mail = Mail()

def create_app(config_name='default'):
    """Application factory pattern"""
    from config import config
    
    app = Flask(__name__, 
                template_folder='templates', 
                static_folder='static', 
                static_url_path='/static')
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    CORS(app)
    
    # Stripe configuration
    stripe.api_key = app.config['STRIPE_SECRET_KEY']
    
    # Create upload folders
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    thumb_folder = os.path.join(app.config['UPLOAD_FOLDER'], 'thumbs')
    os.makedirs(thumb_folder, exist_ok=True)
    
    # Register blueprints
    from app.routes import main_bp
    from app.auth_routes import auth_bp
    from app.listing_routes import listing_bp
    from app.admin_routes import admin_bp
    from app.api_routes import api_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(listing_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(api_bp)
    
    # User loader
    from app.models import User
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Session management
    @app.before_request
    def make_session_permanent():
        if current_user.is_authenticated:
            session.permanent = True
    
    # Context processors
    @app.context_processor
    def inject_listings_count():
        listings_count = 0
        if current_user.is_authenticated:
            listings_count = current_user.listings_count
        return dict(listings_count=listings_count)
    
    @app.context_processor
    def inject_verified_badge():
        is_verified_admin = (
            current_user.is_authenticated and 
            current_user.email in app.config['VERIFIED_ADMIN_EMAILS']
        )
        return dict(
            is_verified_admin=is_verified_admin,
            verified_admin_emails=app.config['VERIFIED_ADMIN_EMAILS']
        )
    
    return app