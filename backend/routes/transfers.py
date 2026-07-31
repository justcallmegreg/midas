"""
Transfer routes - handles all transfer CRUD operations and reclaimable transfer workflows.
Supports:
- Creating Account → Sink transfers (optionally marked as reclaimable)
- Creating Source → Account transfers (optionally linking to reclaimable transfers)
- Querying pending recoveries
- Querying recovery history
- Managing transfer metadata and uploads
"""

from datetime import datetime
from uuid import uuid4
from flask import Blueprint, request, jsonify
from sqlalchemy import and_
from database import db
from models import Account, Source, Sink, Category, Transfer, Upload
from schemas import (
    TransferCreate, TransferCreateAccountToSink, TransferCreateSourceToAccount,
    TransferUpdate, TransferResponse, TransferResponseWithRecoveryInfo,
    ListResponse, ErrorResponse
)
from pydantic import ValidationError

transfers_bp = Blueprint('transfers', __name__, url_prefix='/api/transfers')


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def validate_entity_exists(entity_type: str, entity_id: str):
    """Validate that an entity exists and return it."""
    models = {
        'account': Account,
        'source': Source,
        'sink': Sink,
        'category': Category,
    }
    
    if entity_type not in models:
        raise ValueError(f'Invalid entity type: {entity_type}')
    
    entity = db.query(models[entity_type]).filter_by(id=entity_id).first()
    if not entity:
        raise ValueError(f'{entity_type.capitalize()} {entity_id} not found')
    
    return entity


def create_transfer_response(transfer, include_recovery=False):
    """Create a response dict from a Transfer object."""
    if include_recovery:
        return TransferResponseWithRecoveryInfo.from_transfer(transfer).model_dump()
    return TransferResponse.model_validate(transfer).model_dump()


# ============================================================================
# CREATE TRANSFER ENDPOINTS
# ============================================================================

@transfers_bp.route('', methods=['POST'])
def create_transfer():
    """
    Create a new transfer.
    
    Supports:
    - Account → Sink (optionally marked as reclaimable)
    - Source → Account (optionally linked to reclaimable transfer)
    - Account → Account (simple transfer)
    - Source → Sink (not typical but allowed)
    
    Request body:
    {
        "date": "2024-01-15T10:30:00",
        "amount": 1000.00,
        "currency": "USD",
        "description": "Insurance claim payout",
        "ingress_type": "account",
        "ingress_id": "acc_123",
        "egress_type": "sink",
        "egress_id": "sink_456",
        "category_id": "cat_789",
        "is_reclaimable": true,
        "reclaimable_source_name": "Acme Insurance Co"
    }
    """
    try:
        # Parse and validate request
        data = request.get_json()
        transfer_data = TransferCreate(**data)
        
        # Validate entities exist
        try:
            ingress = validate_entity_exists(transfer_data.ingress_type, transfer_data.ingress_id)
            egress = validate_entity_exists(transfer_data.egress_type, transfer_data.egress_id)
        except ValueError as e:
            return jsonify({
                'error': 'Entity not found',
                'details': str(e)
            }), 400
        
        # Validate category if provided
        category = None
        if transfer_data.category_id:
            try:
                category = validate_entity_exists('category', transfer_data.category_id)
            except ValueError as e:
                return jsonify({
                    'error': 'Category not found',
                    'details': str(e)
                }), 400
        
        # Generate transfer ID upfront so we can use it for bidirectional linking
        transfer_id = str(uuid4())
        
        # Create transfer
        transfer = Transfer(
            id=transfer_id,
            date=transfer_data.date,
            amount=transfer_data.amount,
            currency=transfer_data.currency,
            description=transfer_data.description,
            ingress_type=transfer_data.ingress_type,
            ingress_id=transfer_data.ingress_id,
            egress_type=transfer_data.egress_type,
            egress_id=transfer_data.egress_id,
            category_id=transfer_data.category_id,
            is_reclaimable=transfer_data.is_reclaimable,
            reclaimable_source_name=transfer_data.reclaimable_source_name,
        )
        
        # Add the transfer first (to satisfy FK constraint for recovery linking)
        db.add(transfer)
        db.flush()  # Flush to ensure it's in the DB before we update the original
        
        # Handle recovery linking for Source → Account transfers
        if transfer_data.reclaimed_from_transfer_id:
            original = db.query(Transfer).filter_by(
                id=transfer_data.reclaimed_from_transfer_id
            ).first()
            
            if not original:
                db.rollback()
                return jsonify({
                    'error': 'Referenced transfer not found',
                    'details': f'Transfer {transfer_data.reclaimed_from_transfer_id} does not exist'
                }), 404
            
            if not original.is_reclaimable:
                db.rollback()
                return jsonify({
                    'error': 'Invalid recovery linking',
                    'details': 'Can only recover transfers marked as reclaimable'
                }), 400
            
            if original.reclaimed_by_transfer_id:
                db.rollback()
                return jsonify({
                    'error': 'Transfer already recovered',
                    'details': f'Transfer {transfer_data.reclaimed_from_transfer_id} was already recovered'
                }), 409
            
            # Link the transfers (bidirectional): original points to recovery via reclaimed_by_transfer_id
            original.reclaimed_by_transfer_id = transfer_id
        
        db.commit()
        
        return jsonify(create_transfer_response(transfer, include_recovery=True)), 201
    
    except ValidationError as e:
        return jsonify({
            'error': 'Validation error',
            'details': str(e.errors())
        }), 400
    except ValueError as e:
        return jsonify({
            'error': 'Invalid request',
            'details': str(e)
        }), 400
    except Exception as e:
        db.rollback()
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500


# ============================================================================
# GET TRANSFER ENDPOINTS
# ============================================================================

@transfers_bp.route('/<transfer_id>', methods=['GET'])
def get_transfer(transfer_id):
    """Get a single transfer by ID."""
    try:
        transfer = db.query(Transfer).filter_by(id=transfer_id).first()
        
        if not transfer:
            return jsonify({'error': 'Transfer not found'}), 404
        
        return jsonify(create_transfer_response(transfer, include_recovery=True)), 200
    
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500


@transfers_bp.route('', methods=['GET'])
def list_transfers():
    """
    List transfers with optional filtering.
    
    Query parameters:
    - ingress_type: Filter by ingress type (account, source)
    - ingress_id: Filter by ingress entity ID
    - egress_type: Filter by egress type (account, sink)
    - egress_id: Filter by egress entity ID
    - category_id: Filter by category
    - is_reclaimable: Filter by reclaimable status (true/false)
    - recovered: Filter by recovery status (true/false)
    - limit: Pagination limit (default 20, max 100)
    - offset: Pagination offset (default 0)
    """
    try:
        # Parse pagination
        limit = min(int(request.args.get('limit', 20)), 100)
        offset = int(request.args.get('offset', 0))
        
        # Build query
        query = db.query(Transfer)
        
        # Apply filters
        if request.args.get('ingress_type'):
            query = query.filter_by(ingress_type=request.args.get('ingress_type'))
        if request.args.get('ingress_id'):
            query = query.filter_by(ingress_id=request.args.get('ingress_id'))
        if request.args.get('egress_type'):
            query = query.filter_by(egress_type=request.args.get('egress_type'))
        if request.args.get('egress_id'):
            query = query.filter_by(egress_id=request.args.get('egress_id'))
        if request.args.get('category_id'):
            query = query.filter_by(category_id=request.args.get('category_id'))
        
        # Reclaimable filter
        if request.args.get('is_reclaimable'):
            is_reclaimable = request.args.get('is_reclaimable').lower() == 'true'
            query = query.filter_by(is_reclaimable=is_reclaimable)
        
        # Recovery status filter
        if request.args.get('recovered'):
            recovered = request.args.get('recovered').lower() == 'true'
            if recovered:
                query = query.filter(Transfer.reclaimed_by_transfer_id.isnot(None))
            else:
                query = query.filter(Transfer.reclaimed_by_transfer_id.is_(None))
        
        # Count total
        total = query.count()
        
        # Apply pagination and sorting
        transfers = query.order_by(Transfer.date.desc()).offset(offset).limit(limit).all()
        
        items = [create_transfer_response(t, include_recovery=True) for t in transfers]
        
        return jsonify({
            'items': items,
            'total': total,
            'limit': limit,
            'offset': offset
        }), 200
    
    except ValueError as e:
        return jsonify({
            'error': 'Invalid query parameters',
            'details': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500


@transfers_bp.route('/pending-recovery', methods=['GET'])
def list_pending_recoveries():
    """
    List transfers pending recovery.
    Returns Account → Sink transfers where is_reclaimable=true and reclaimed_by_transfer_id IS NULL.
    
    Query parameters:
    - limit: Pagination limit (default 20, max 100)
    - offset: Pagination offset (default 0)
    """
    try:
        limit = min(int(request.args.get('limit', 20)), 100)
        offset = int(request.args.get('offset', 0))
        
        query = db.query(Transfer).filter(
            and_(
                Transfer.is_reclaimable == True,
                Transfer.reclaimed_by_transfer_id.is_(None)
            )
        )
        
        total = query.count()
        transfers = query.order_by(Transfer.date.desc()).offset(offset).limit(limit).all()
        
        items = [create_transfer_response(t, include_recovery=True) for t in transfers]
        
        return jsonify({
            'items': items,
            'total': total,
            'limit': limit,
            'offset': offset
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500


@transfers_bp.route('/recovery-history', methods=['GET'])
def list_recovery_history():
    """
    List recovered transfers.
    Returns all transfers that have reclaimed_by_transfer_id set.
    
    Query parameters:
    - limit: Pagination limit (default 20, max 100)
    - offset: Pagination offset (default 0)
    """
    try:
        limit = min(int(request.args.get('limit', 20)), 100)
        offset = int(request.args.get('offset', 0))
        
        query = db.query(Transfer).filter(
            Transfer.reclaimed_by_transfer_id.isnot(None)
        )
        
        total = query.count()
        transfers = query.order_by(Transfer.date.desc()).offset(offset).limit(limit).all()
        
        items = [create_transfer_response(t, include_recovery=True) for t in transfers]
        
        return jsonify({
            'items': items,
            'total': total,
            'limit': limit,
            'offset': offset
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500


# ============================================================================
# UPDATE TRANSFER ENDPOINT
# ============================================================================

@transfers_bp.route('/<transfer_id>', methods=['PATCH'])
def update_transfer(transfer_id):
    """
    Update transfer metadata.
    Can only update description and category_id (not amounts or links).
    """
    try:
        transfer = db.query(Transfer).filter_by(id=transfer_id).first()
        if not transfer:
            return jsonify({'error': 'Transfer not found'}), 404
        
        data = request.get_json()
        update_data = TransferUpdate(**data)
        
        # Validate category if provided
        if update_data.category_id:
            try:
                validate_entity_exists('category', update_data.category_id)
                transfer.category_id = update_data.category_id
            except ValueError as e:
                return jsonify({
                    'error': 'Category not found',
                    'details': str(e)
                }), 400
        
        if update_data.description is not None:
            transfer.description = update_data.description
        
        db.commit()
        return jsonify(create_transfer_response(transfer, include_recovery=True)), 200
    
    except ValidationError as e:
        return jsonify({
            'error': 'Validation error',
            'details': str(e.errors())
        }), 400
    except ValueError as e:
        return jsonify({
            'error': 'Invalid request',
            'details': str(e)
        }), 400
    except Exception as e:
        db.rollback()
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500


# ============================================================================
# DELETE TRANSFER ENDPOINT
# ============================================================================

@transfers_bp.route('/<transfer_id>', methods=['DELETE'])
def delete_transfer(transfer_id):
    """
    Delete a transfer.
    Also clears the reclaimed_by_transfer_id on the original reclaimable transfer if this is a recovery.
    """
    try:
        transfer = db.query(Transfer).filter_by(id=transfer_id).first()
        if not transfer:
            return jsonify({'error': 'Transfer not found'}), 404
        
        # If this transfer was recovering another, clear the link
        original = db.query(Transfer).filter_by(
            reclaimed_by_transfer_id=transfer_id
        ).first()
        if original:
            original.reclaimed_by_transfer_id = None
        
        db.delete(transfer)
        db.commit()
        
        return jsonify({'message': 'Transfer deleted'}), 200
    
    except Exception as e:
        db.rollback()
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500


# ============================================================================
# SUMMARY & STATISTICS ENDPOINTS
# ============================================================================

@transfers_bp.route('/stats/summary', methods=['GET'])
def get_transfer_summary():
    """
    Get summary statistics about transfers.
    Returns counts of total, reclaimable, pending recovery, and recovered transfers.
    """
    try:
        total_count = db.query(Transfer).count()
        reclaimable_count = db.query(Transfer).filter_by(is_reclaimable=True).count()
        pending_recovery_count = db.query(Transfer).filter(
            and_(
                Transfer.is_reclaimable == True,
                Transfer.reclaimed_by_transfer_id.is_(None)
            )
        ).count()
        recovered_count = db.query(Transfer).filter(
            Transfer.reclaimed_by_transfer_id.isnot(None)
        ).count()
        
        return jsonify({
            'total_transfers': total_count,
            'reclaimable_transfers': reclaimable_count,
            'pending_recovery': pending_recovery_count,
            'recovered': recovered_count,
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500
