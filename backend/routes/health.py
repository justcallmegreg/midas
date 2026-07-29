"""
Health check endpoint.
Verifies application and database connectivity.
"""

from flask import Blueprint, jsonify
from database import check_db_connection

health_bp = Blueprint('health', __name__)


@health_bp.route('/healthz', methods=['GET'])
def healthz():
    """
    Health check endpoint.
    
    Returns:
        - 200 with {"status": "healthy"} if app and database are OK
        - 503 with {"status": "unhealthy", "error": "..."} if database fails
    """
    # Check database connectivity
    db_ok, db_error = check_db_connection()

    if not db_ok:
        return jsonify({
            "status": "unhealthy",
            "error": f"Database connection failed: {db_error}"
        }), 503

    return jsonify({
        "status": "healthy"
    }), 200
