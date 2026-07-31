"""
Flask application factory.
Creates and configures the Flask app with all blueprints and extensions.
"""

import os
from flask import Flask, jsonify
from config import config
from database import init_db, db
from routes.health import health_bp
from routes.transfers import transfers_bp


def create_app():
    """
    Application factory function.
    Creates and configures Flask app with database and routes.

    Returns:
        Flask: Configured Flask application instance
    """
    app = Flask(__name__)

    # Load configuration from config.py
    app.config.from_object(config)

    # Initialize database
    init_db()

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(transfers_bp)
    
    # Teardown scoped session after each request
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db.remove()

    # Log startup information
    print(f"[INFO] Flask app initialized")
    print(f"[INFO] Database: {app.config['SQLALCHEMY_DATABASE_URI']}")
    print(f"[INFO] Debug: {app.config['DEBUG']}")
    print(f"[INFO] Testing: {app.config['TESTING']}")

    return app


# Create app instance for direct execution
app = create_app()


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({"error": "Not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    # Get host and port from config
    host = app.config.get('HOST', '0.0.0.0')
    port = app.config.get('PORT', 5000)
    debug = app.config.get('DEBUG', False)

    print(f"[INFO] Starting Flask development server on {host}:{port}")
    app.run(host=host, port=port, debug=debug)
