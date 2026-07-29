"""
Pytest configuration and fixtures.
"""

import os
import sys
import pytest

# Add parent directory to path so imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture
def app():
    """Create test Flask app with in-memory SQLite database"""
    os.environ['ENVIRONMENT'] = 'testing'
    from app import create_app
    app = create_app()
    return app


@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()


@pytest.fixture
def runner(app):
    """Create test CLI runner"""
    return app.test_cli_runner()
