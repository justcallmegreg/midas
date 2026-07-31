"""
Pydantic schemas for request/response validation.
Includes schemas for all entities and the reclaimable transfers feature.
"""

from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator, model_validator


# ============================================================================
# ACCOUNT SCHEMAS
# ============================================================================

class AccountCreate(BaseModel):
    """Schema for creating a new account."""
    name: str = Field(..., min_length=1, max_length=255, description="Account name")
    description: Optional[str] = Field(None, max_length=1000)
    currency: str = Field(default='USD', pattern=r'^[A-Z]{3}$', description="ISO 4217 currency code")

    @field_validator('currency')
    def validate_currency(cls, v):
        if not v.isupper() or len(v) != 3:
            raise ValueError('Currency must be 3-letter uppercase code (ISO 4217)')
        return v


class AccountUpdate(BaseModel):
    """Schema for updating an account."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)


class AccountResponse(BaseModel):
    """Schema for account response."""
    id: str
    name: str
    description: Optional[str]
    balance: Decimal
    currency: str
    created_at: datetime
    updated_at: datetime

    model_config = {'from_attributes': True}


# ============================================================================
# SOURCE SCHEMAS
# ============================================================================

class SourceCreate(BaseModel):
    """Schema for creating a new source."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)


class SourceUpdate(BaseModel):
    """Schema for updating a source."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)


class SourceResponse(BaseModel):
    """Schema for source response."""
    id: str
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {'from_attributes': True}


# ============================================================================
# SINK SCHEMAS
# ============================================================================

class SinkCreate(BaseModel):
    """Schema for creating a new sink."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)


class SinkUpdate(BaseModel):
    """Schema for updating a sink."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)


class SinkResponse(BaseModel):
    """Schema for sink response."""
    id: str
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {'from_attributes': True}


# ============================================================================
# CATEGORY SCHEMAS
# ============================================================================

class CategoryCreate(BaseModel):
    """Schema for creating a new category."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)


class CategoryUpdate(BaseModel):
    """Schema for updating a category."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)


class CategoryResponse(BaseModel):
    """Schema for category response."""
    id: str
    name: str
    description: Optional[str]
    created_at: datetime

    model_config = {'from_attributes': True}


# ============================================================================
# TRANSFER SCHEMAS
# ============================================================================

class TransferCreateAccountToSink(BaseModel):
    """
    Schema for creating Account → Sink transfer.
    Can be marked as reclaimable with source name.
    """
    date: datetime
    amount: Decimal = Field(..., gt=0, decimal_places=2, max_digits=15)
    currency: str = Field(default='USD', pattern=r'^[A-Z]{3}$')
    description: Optional[str] = Field(None, max_length=1000)
    ingress_id: str = Field(..., description="Account ID")
    egress_id: str = Field(..., description="Sink ID")
    category_id: Optional[str] = None
    
    # Reclaimable transfer fields
    is_reclaimable: bool = Field(default=False, description="Mark as eligible for recovery")
    reclaimable_source_name: Optional[str] = Field(
        None, 
        max_length=255, 
        description="Name of entity that will recover this. Required if is_reclaimable=true"
    )

    @field_validator('reclaimable_source_name')
    def validate_reclaimable_source_name(cls, v, info):
        if info.data.get('is_reclaimable') and not v:
            raise ValueError('reclaimable_source_name is required when is_reclaimable=true')
        if v and not info.data.get('is_reclaimable'):
            raise ValueError('reclaimable_source_name should only be set when is_reclaimable=true')
        return v


class TransferCreateSourceToAccount(BaseModel):
    """
    Schema for creating Source → Account transfer.
    Can reference a reclaimable transfer to mark it as recovered.
    """
    date: datetime
    amount: Decimal = Field(..., gt=0, decimal_places=2, max_digits=15)
    currency: str = Field(default='USD', pattern=r'^[A-Z]{3}$')
    description: Optional[str] = Field(None, max_length=1000)
    ingress_id: str = Field(..., description="Source ID")
    egress_id: str = Field(..., description="Account ID")
    category_id: Optional[str] = None
    
    # Recovery linking
    reclaimed_from_transfer_id: Optional[str] = Field(
        None,
        description="ID of the reclaimable transfer this recovers"
    )


class TransferCreate(BaseModel):
    """
    Generic transfer creation schema.
    Validates ingress/egress types and reclaimable constraints.
    """
    date: datetime
    amount: Decimal = Field(..., gt=0, decimal_places=2, max_digits=15)
    currency: str = Field(default='USD', pattern=r'^[A-Z]{3}$')
    description: Optional[str] = Field(None, max_length=1000)
    ingress_type: str = Field(..., pattern=r'^(account|source)$')
    ingress_id: str
    egress_type: str = Field(..., pattern=r'^(account|sink)$')
    egress_id: str
    category_id: Optional[str] = None
    is_reclaimable: bool = Field(default=False)
    reclaimable_source_name: Optional[str] = Field(None, max_length=255)
    reclaimed_from_transfer_id: Optional[str] = None

    @model_validator(mode='after')
    def validate_transfer_constraints(self):
        # Validate reclaimable is only for Account → Sink
        if self.is_reclaimable:
            if self.ingress_type != 'account' or self.egress_type != 'sink':
                raise ValueError('is_reclaimable=true only valid for Account → Sink transfers')
            # Validate reclaimable_source_name is required
            if not self.reclaimable_source_name:
                raise ValueError('reclaimable_source_name required when is_reclaimable=true')
        
        # Validate reclaimed_from_transfer_id is only for Source → Account
        if self.reclaimed_from_transfer_id:
            if self.ingress_type != 'source' or self.egress_type != 'account':
                raise ValueError('reclaimed_from_transfer_id only valid for Source → Account transfers')
        
        return self


class TransferUpdate(BaseModel):
    """Schema for updating a transfer (limited fields)."""
    description: Optional[str] = Field(None, max_length=1000)
    category_id: Optional[str] = None


class TransferResponse(BaseModel):
    """Schema for transfer response."""
    id: str
    date: datetime
    amount: Decimal
    currency: str
    description: Optional[str]
    ingress_type: str
    ingress_id: str
    egress_type: str
    egress_id: str
    category_id: Optional[str]
    is_reclaimable: bool
    reclaimable_source_name: Optional[str]
    reclaimed_by_transfer_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {'from_attributes': True}


class TransferResponseWithRecoveryInfo(TransferResponse):
    """Extended response including recovery status."""
    recovery_status: str = Field(description="'pending_recovery', 'recovered', or 'not_reclaimable'")
    recovery_transfer: Optional['TransferResponse'] = None

    @classmethod
    def from_transfer(cls, transfer):
        """Create response with recovery status."""
        if not transfer.is_reclaimable:
            recovery_status = 'not_reclaimable'
        elif transfer.reclaimed_by_transfer_id:
            recovery_status = 'recovered'
        else:
            recovery_status = 'pending_recovery'
        
        data = TransferResponse.model_validate(transfer).model_dump()
        data['recovery_status'] = recovery_status
        if transfer.recovery_transfer:
            data['recovery_transfer'] = TransferResponse.model_validate(transfer.recovery_transfer)
        
        return cls(**data)


# ============================================================================
# UPLOAD SCHEMAS
# ============================================================================

class UploadResponse(BaseModel):
    """Schema for upload response."""
    id: str
    transfer_id: str
    file_name: str
    storage_key: str
    file_size: Decimal
    mime_type: str
    uploaded_at: datetime

    model_config = {'from_attributes': True}


# ============================================================================
# ERROR SCHEMAS
# ============================================================================

class ErrorResponse(BaseModel):
    """Standard error response."""
    error: str
    details: Optional[str] = None


# ============================================================================
# LIST RESPONSE SCHEMAS
# ============================================================================

class ListResponse(BaseModel):
    """Generic list response wrapper."""
    items: List
    total: int
    limit: int
    offset: int