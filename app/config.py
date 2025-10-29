import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    DEBUG = True
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URI',
        'postgresql://postgres:postgre@69.62.113.129:5432/Dealify'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session
    PERMANENT_SESSION_LIFETIME = timedelta(days=3650)  # 10 years
    
    # File Upload
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'app', 'static', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    
    # Twilio
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
    TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')
    
    # Mail
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = 'dealifyuae@gmail.com'
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD', 'rxwehbucssikmmex')
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    
    # Stripe
    STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
    STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', 'whsec_W1a6j4PendMEPsiYt5q3kiRMAG6pVUvq')
    
    # Apple
    APPLE_CLIENT_ID = os.getenv('APPLE_CLIENT_ID')
    
    # Google
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '828643865110-2g1ck8e814o93r7b3mja4tbnms41vsb8.apps.googleusercontent.com')
    
    # Admin
    VERIFIED_ADMIN_EMAILS = [
        "admin@gmail.com",
        "hussainalrubaiy6@gmail.com",
        "naeabirkdar@gmail.com",
        "ryzrayeez@gmail.com",
        "rtelgeneral@yahoo.com"
    ]


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}