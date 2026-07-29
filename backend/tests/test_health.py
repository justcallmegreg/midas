"""
Tests for the health check endpoint.
"""

import json
import pytest


def test_healthz_returns_200(client):
    """Test that /healthz returns 200 when healthy"""
    response = client.get('/healthz')
    assert response.status_code == 200


def test_healthz_returns_json(client):
    """Test that /healthz returns JSON with status field"""
    response = client.get('/healthz')
    data = json.loads(response.data)
    assert 'status' in data
    assert data['status'] == 'healthy'


def test_healthz_content_type(client):
    """Test that /healthz returns JSON content type"""
    response = client.get('/healthz')
    assert response.content_type == 'application/json'


def test_healthz_structure(client):
    """Test the structure of the health response"""
    response = client.get('/healthz')
    data = json.loads(response.data)
    
    assert isinstance(data, dict)
    assert 'status' in data
    assert data['status'] in ['healthy', 'unhealthy']


def test_healthz_method_not_allowed(client):
    """Test that POST /healthz returns 405"""
    response = client.post('/healthz')
    assert response.status_code == 405


def test_healthz_method_not_allowed_put(client):
    """Test that PUT /healthz returns 405"""
    response = client.put('/healthz')
    assert response.status_code == 405
