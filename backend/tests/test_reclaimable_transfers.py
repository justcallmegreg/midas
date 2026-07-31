"""
Tests for reclaimable transfers feature.
Tests the complete workflow:
1. Create Account → Sink transfer marked as reclaimable
2. Query pending recoveries
3. Create Source → Account transfer to recover it
4. Verify bidirectional linking
5. Test validation constraints
"""

import pytest
import os
from datetime import datetime
from decimal import Decimal
from app import create_app
from database import Base, engine, SessionLocal
from models import Account, Source, Sink, Category, Transfer


@pytest.fixture
def app():
    """Create application for testing."""
    # Use in-memory SQLite for tests
    os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
    
    app = create_app()
    app.config['TESTING'] = True
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    yield app
    
    # Cleanup
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(app):
    """Create test client."""
    return app.test_client()


@pytest.fixture
def sample_data(app):
    """Create sample accounts, sources, sinks."""
    session = SessionLocal()
    try:
        account = Account(name='Main Account', currency='USD', balance=Decimal('10000.00'))
        source = Source(name='Acme Insurance Co')
        sink = Sink(name='Medical Expense')
        category = Category(name='Healthcare')
        
        session.add_all([account, source, sink, category])
        session.commit()
        
        # Keep IDs, but detach objects before returning to avoid session issues
        data = {
            'account_id': account.id,
            'source_id': source.id,
            'sink_id': sink.id,
            'category_id': category.id,
        }
        return data
    finally:
        session.close()


class TestReclaimableTransfersWorkflow:
    """Test the complete reclaimable transfers workflow."""
    
    def test_create_reclaimable_account_to_sink_transfer(self, client, sample_data):
        """Test creating Account → Sink transfer marked as reclaimable."""
        response = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 1000.00,
            'currency': 'USD',
            'description': 'Medical expense - expecting insurance recovery',
            'ingress_type': 'account',
            'ingress_id': sample_data['account_id'],
            'egress_type': 'sink',
            'egress_id': sample_data['sink_id'],
            'category_id': sample_data['category_id'],
            'is_reclaimable': True,
            'reclaimable_source_name': 'Acme Insurance Co',
        })
        
        assert response.status_code == 201
        data = response.get_json()
        assert data['is_reclaimable'] == True
        assert data['reclaimable_source_name'] == 'Acme Insurance Co'
        assert data['reclaimed_by_transfer_id'] is None
        assert data['recovery_status'] == 'pending_recovery'
    
    def test_create_recovery_transfer_and_link_to_reclaimable(self, client, sample_data):
        """Test creating Source → Account transfer that recovers reclaimable transfer."""
        # Step 1: Create reclaimable transfer
        response1 = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 1000.00,
            'currency': 'USD',
            'ingress_type': 'account',
            'ingress_id': sample_data['account_id'],
            'egress_type': 'sink',
            'egress_id': sample_data['sink_id'],
            'is_reclaimable': True,
            'reclaimable_source_name': 'Acme Insurance Co',
        })
        assert response1.status_code == 201
        original_id = response1.get_json()['id']
        
        # Step 2: Create recovery transfer linked to original
        response2 = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 1000.00,
            'currency': 'USD',
            'description': 'Insurance payout',
            'ingress_type': 'source',
            'ingress_id': sample_data['source_id'],
            'egress_type': 'account',
            'egress_id': sample_data['account_id'],
            'reclaimed_from_transfer_id': original_id,
        })
        assert response2.status_code == 201
        recovery_data = response2.get_json()
        recovery_id = recovery_data['id']
        
        # Step 3: Verify bidirectional linking
        # Original transfer should now have reclaimed_by_transfer_id set
        response3 = client.get(f'/api/transfers/{original_id}')
        assert response3.status_code == 200
        original_data = response3.get_json()
        assert original_data['reclaimed_by_transfer_id'] == recovery_id
        assert original_data['recovery_status'] == 'recovered'
        
        # Recovery transfer should reference original
        assert recovery_data['reclaimed_by_transfer_id'] is None  # Recovery doesn't point back
        assert recovery_data['recovery_status'] == 'not_reclaimable'
    
    def test_query_pending_recoveries(self, client, sample_data):
        """Test querying pending recovery transfers."""
        # Create multiple transfers
        for i in range(3):
            client.post('/api/transfers', json={
                'date': datetime.now().isoformat(),
                'amount': 100.00 * (i + 1),
                'currency': 'USD',
                'ingress_type': 'account',
                'ingress_id': sample_data['account_id'],
                'egress_type': 'sink',
                'egress_id': sample_data['sink_id'],
                'is_reclaimable': True,
                'reclaimable_source_name': 'Test Source',
            })
        
        # Create a recovery for the first one
        response1 = client.get('/api/transfers/pending-recovery')
        assert response1.status_code == 200
        all_pending = response1.get_json()
        first_id = all_pending['items'][2]['id']  # Most recent (reverse sort)
        
        client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 100.00,
            'currency': 'USD',
            'ingress_type': 'source',
            'ingress_id': sample_data['source_id'],
            'egress_type': 'account',
            'egress_id': sample_data['account_id'],
            'reclaimed_from_transfer_id': first_id,
        })
        
        # Query pending - should now be 2 instead of 3
        response2 = client.get('/api/transfers/pending-recovery')
        assert response2.status_code == 200
        data = response2.get_json()
        assert data['total'] == 2
        assert len(data['items']) == 2
    
    def test_query_recovery_history(self, client, sample_data):
        """Test querying recovered transfers."""
        # Create and recover a transfer
        response1 = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 500.00,
            'currency': 'USD',
            'ingress_type': 'account',
            'ingress_id': sample_data['account_id'],
            'egress_type': 'sink',
            'egress_id': sample_data['sink_id'],
            'is_reclaimable': True,
            'reclaimable_source_name': 'Test',
        })
        original_id = response1.get_json()['id']
        
        response2 = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 500.00,
            'currency': 'USD',
            'ingress_type': 'source',
            'ingress_id': sample_data['source_id'],
            'egress_type': 'account',
            'egress_id': sample_data['account_id'],
            'reclaimed_from_transfer_id': original_id,
        })
        recovery_id = response2.get_json()['id']
        
        # Query recovery history
        response3 = client.get('/api/transfers/recovery-history')
        assert response3.status_code == 200
        data = response3.get_json()
        assert data['total'] == 1
        assert data['items'][0]['id'] == original_id


class TestReclaimableTransfersValidation:
    """Test validation constraints for reclaimable transfers."""
    
    def test_cannot_mark_non_sink_transfer_as_reclaimable(self, client, sample_data):
        """Test that only Account → Sink can be marked reclaimable."""
        # Try Source → Account
        response = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 100.00,
            'currency': 'USD',
            'ingress_type': 'source',
            'ingress_id': sample_data['source_id'],
            'egress_type': 'account',
            'egress_id': sample_data['account_id'],
            'is_reclaimable': True,
            'reclaimable_source_name': 'Test',
        })
        
        assert response.status_code == 400
        details = response.get_json().get('details', '')
        assert 'only valid for Account → Sink' in str(details)
    
    def test_reclaimable_source_name_required_when_is_reclaimable(self, client, sample_data):
        """Test that reclaimable_source_name is required when is_reclaimable=true."""
        response = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 100.00,
            'currency': 'USD',
            'ingress_type': 'account',
            'ingress_id': sample_data['account_id'],
            'egress_type': 'sink',
            'egress_id': sample_data['sink_id'],
            'is_reclaimable': True,
            # Missing reclaimable_source_name
        })
        
        assert response.status_code == 400
        details = response.get_json().get('details', '')
        assert 'reclaimable_source_name required' in str(details)
    
    def test_cannot_recover_non_reclaimable_transfer(self, client, sample_data):
        """Test that recovery can only link to reclaimable transfers."""
        # Create non-reclaimable transfer
        response1 = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 100.00,
            'currency': 'USD',
            'ingress_type': 'account',
            'ingress_id': sample_data['account_id'],
            'egress_type': 'sink',
            'egress_id': sample_data['sink_id'],
            'is_reclaimable': False,
        })
        non_reclaimable_id = response1.get_json()['id']
        
        # Try to recover it
        response2 = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 100.00,
            'currency': 'USD',
            'ingress_type': 'source',
            'ingress_id': sample_data['source_id'],
            'egress_type': 'account',
            'egress_id': sample_data['account_id'],
            'reclaimed_from_transfer_id': non_reclaimable_id,
        })
        
        assert response2.status_code == 400
        details = response2.get_json().get('details', '')
        assert 'marked as reclaimable' in str(details)
    
    def test_cannot_double_recover_transfer(self, client, sample_data):
        """Test that a transfer can only be recovered once."""
        # Create reclaimable transfer
        response1 = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 100.00,
            'currency': 'USD',
            'ingress_type': 'account',
            'ingress_id': sample_data['account_id'],
            'egress_type': 'sink',
            'egress_id': sample_data['sink_id'],
            'is_reclaimable': True,
            'reclaimable_source_name': 'Test',
        })
        reclaimable_id = response1.get_json()['id']
        
        # First recovery - should succeed
        response2 = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 100.00,
            'currency': 'USD',
            'ingress_type': 'source',
            'ingress_id': sample_data['source_id'],
            'egress_type': 'account',
            'egress_id': sample_data['account_id'],
            'reclaimed_from_transfer_id': reclaimable_id,
        })
        assert response2.status_code == 201
        
        # Second recovery - should fail
        response3 = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 100.00,
            'currency': 'USD',
            'ingress_type': 'source',
            'ingress_id': sample_data['source_id'],
            'egress_type': 'account',
            'egress_id': sample_data['account_id'],
            'reclaimed_from_transfer_id': reclaimable_id,
        })
        
        assert response3.status_code == 409
        details = response3.get_json().get('details', '')
        assert 'already recovered' in str(details)
    
    def test_recovery_only_for_source_to_account(self, client, sample_data):
        """Test that reclaimed_from_transfer_id only works for Source → Account."""
        # Create reclaimable transfer
        response1 = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 100.00,
            'currency': 'USD',
            'ingress_type': 'account',
            'ingress_id': sample_data['account_id'],
            'egress_type': 'sink',
            'egress_id': sample_data['sink_id'],
            'is_reclaimable': True,
            'reclaimable_source_name': 'Test',
        })
        reclaimable_id = response1.get_json()['id']
        
        # Try Account → Sink with reclaimed_from_transfer_id
        response2 = client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 100.00,
            'currency': 'USD',
            'ingress_type': 'account',
            'ingress_id': sample_data['account_id'],
            'egress_type': 'sink',
            'egress_id': sample_data['sink_id'],
            'reclaimed_from_transfer_id': reclaimable_id,
        })
        
        assert response2.status_code == 400
        details = response2.get_json().get('details', '')
        assert 'only valid for Source → Account' in str(details)


class TestTransferStatistics:
    """Test transfer statistics endpoints."""
    
    def test_get_transfer_summary(self, client, sample_data):
        """Test getting transfer summary statistics."""
        # Create various transfers
        client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 100.00,
            'currency': 'USD',
            'ingress_type': 'account',
            'ingress_id': sample_data['account_id'],
            'egress_type': 'sink',
            'egress_id': sample_data['sink_id'],
            'is_reclaimable': True,
            'reclaimable_source_name': 'Test',
        })
        
        client.post('/api/transfers', json={
            'date': datetime.now().isoformat(),
            'amount': 100.00,
            'currency': 'USD',
            'ingress_type': 'account',
            'ingress_id': sample_data['account_id'],
            'egress_type': 'sink',
            'egress_id': sample_data['sink_id'],
            'is_reclaimable': False,
        })
        
        response = client.get('/api/transfers/stats/summary')
        assert response.status_code == 200
        data = response.get_json()
        assert data['total_transfers'] == 2
        assert data['reclaimable_transfers'] == 1
        assert data['pending_recovery'] == 1
        assert data['recovered'] == 0
