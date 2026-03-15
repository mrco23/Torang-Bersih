"""Environment configuration"""
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


def get_env(key, default=None, cast=str):
    value = os.getenv(key, default)
    if value is None:
        return None
    if cast == bool:
        return value.lower() in ('true', '1', 'yes')
    return cast(value)


class Config:
    PORT = get_env('PORT', 5000, int)
    HOST = get_env('HOST', '127.0.0.1')
    # Flask
    SECRET_KEY = get_env('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Database
    SQLALCHEMY_DATABASE_URI = get_env('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/proxo_coris')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {'pool_pre_ping': True, 'pool_recycle': 300}
    
    # JWT
    JWT_SECRET_KEY = get_env('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    
    # Frontend
    FRONTEND_URL = get_env('FRONTEND_URL', 'http://localhost:5173')
    
    # CORS
    CORS_ORIGINS = get_env('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
    
    # Mail
    MAIL_SERVER = get_env('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = get_env('MAIL_PORT', 587, int)
    MAIL_USE_TLS = get_env('MAIL_USE_TLS', 'True', bool)
    MAIL_USE_SSL = get_env('MAIL_USE_SSL', 'False', bool)
    MAIL_USERNAME = get_env('MAIL_USERNAME')
    MAIL_PASSWORD = get_env('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = get_env('MAIL_DEFAULT_SENDER')

    # Resend
    RESEND_API_KEY = get_env('RESEND_API_KEY')
    MAIL_FROM = get_env('MAIL_FROM')
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME = get_env('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = get_env('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = get_env('CLOUDINARY_API_SECRET')

    # Rate Limiting
    RATELIMIT_DEFAULT = "10000/day;1000/hour;100/minute"
    RATELIMIT_STORAGE_URI = "memory://"
    RATELIMIT_STRATEGY = "fixed-window"
    RATELIMIT_HEADERS_ENABLED = True


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = False
    ENVIRONMENT = 'Development'


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False
    RATELIMIT_DEFAULT = "10000/day;1000/hour;100/minute"
    ENVIRONMENT = 'Production'

class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)
    RATELIMIT_ENABLED = False


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config():
    env = get_env('FLASK_ENV', 'development')
    return config.get(env, config['default'])
