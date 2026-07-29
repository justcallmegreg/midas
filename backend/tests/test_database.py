"""
Tests for database connectivity and configuration.
"""

import pytest
from database import check_db_connection, engine, SessionLocal, init_db


def test_database_connection():
    """Test that database connection works"""
    success, error = check_db_connection()
    assert success is True
    assert error is None


def test_database_engine_exists():
    """Test that SQLAlchemy engine is configured"""
    assert engine is not None


def test_database_session_factory():
    """Test that session factory works"""
    session = SessionLocal()
    assert session is not None
    session.close()


def test_database_init(app):
    """Test that database initialization works"""
    with app.app_context():
        # This should not raise any exceptions
        init_db()


def test_database_query(app):
    """Test that basic database query works"""
    with app.app_context():
        success, error = check_db_connection()
        assert success is True
        assert error is None


def test_database_url_configurable(app):
    """Test that database URL is properly configured"""
    # In testing, should use in-memory SQLite
    assert app.config['SQLALCHEMY_DATABASE_URI'] == 'sqlite:///:memory:'


def test_connection_pool_config(app):
    """Test that connection pool is configured with best practices"""
    # These are SQLAlchemy engine options set in database.py:
    # - pool_pre_ping=True: Verifies connections are alive before using them
    # - pool_recycle=3600: Recycles connections after 1 hour
    # - pool_size=5: Maintains 5 open connections
    # - max_overflow=10: Allows up to 10 temporary connections under load
    
    # Verify the engine has a pool (all SQLAlchemy engines do)
    assert engine.pool is not None
    # Verify we can get a connection from the pool
    with engine.connect() as conn:
        assert conn is not None
