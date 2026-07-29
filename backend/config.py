"""
Configuration module: Loads settings from environment variables.
Supports multiple database backends (SQLite, PostgreSQL, MySQL).
"""

import os
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()


class Config:
    """Base configuration"""

    # Database URL - configurable via DATABASE_URL environment variable
    # Defaults to SQLite for easy local development
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:///./data/akkerman.db'
    )

    # Disable SQLAlchemy modification tracking (saves memory)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Application settings
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    TESTING = os.getenv('TESTING', 'False').lower() == 'true'

    # Server settings
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', 5000))

    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'


class TestingConfig(Config):
    """Testing configuration - uses in-memory SQLite"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False


# Select config based on ENVIRONMENT variable
env = os.getenv('ENVIRONMENT', 'development').lower()
if env == 'production':
    config = ProductionConfig
elif env == 'testing':
    config = TestingConfig
else:
    config = DevelopmentConfig
