"""
Database module: SQLAlchemy engine and session management.
Implements connection pooling best practices for efficient database access.

Connection Pooling Configuration:
  - pool_size=5: Maintains 5 open connections in the pool
  - max_overflow=10: Allows up to 10 additional temporary connections under load
  - pool_pre_ping=True: Verifies connections are alive before using them
  - pool_recycle=3600: Recycles connections after 1 hour (prevents stale connections)

These settings balance resource usage with performance and reliability.
"""

import os
from sqlalchemy import create_engine, text, event
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import QueuePool

# Get database URL from environment, default to SQLite
DATABASE_URL = os.getenv(
    'DATABASE_URL',
    'sqlite:///./data/akkerman.db'
)

# Ensure data directory exists for SQLite
if DATABASE_URL.startswith('sqlite'):
    data_dir = os.path.dirname('./data/akkerman.db')
    if data_dir and not os.path.exists(data_dir):
        os.makedirs(data_dir, exist_ok=True)

# Create engine with connection pooling optimizations
# These settings are best practices for production databases:
# - pool_pre_ping: Verifies connections are alive before using them
# - pool_recycle: Recycles connections after 1 hour (prevents stale connections)
# - pool_size: 5 connections in the pool
# - max_overflow: Allow up to 10 additional temporary connections under load
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False  # Set to True for SQL logging during development
)

# SQLite-specific: Enable foreign keys
if DATABASE_URL.startswith('sqlite'):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_conn, connection_record):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

# Session factory for creating database sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Declarative base for all ORM models
Base = declarative_base()


def get_db():
    """
    Dependency function for getting a database session.
    Yields a session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize database: create all tables defined in models.
    Called on application startup.
    """
    Base.metadata.create_all(bind=engine)


def check_db_connection():
    """
    Check if database is reachable.
    
    Returns:
        tuple: (success: bool, error_message: str or None)
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True, None
    except Exception as e:
        return False, str(e)
