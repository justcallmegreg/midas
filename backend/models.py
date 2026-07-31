"""
SQLAlchemy ORM models for Midas financial management system.
Includes Account, Source, Sink, Category, Transfer, and Upload models.
Supports reclaimable transfers feature for proof-of-transaction uploads.
"""

from datetime import datetime
from decimal import Decimal
from uuid import uuid4
from sqlalchemy import Column, String, DateTime, Boolean, Numeric, ForeignKey, Index, CheckConstraint
from sqlalchemy.orm import relationship
from database import Base


class Account(Base):
    """Account entity - represents an account that can send/receive transfers."""
    __tablename__ = "accounts"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String(255), nullable=False, index=True)
    description = Column(String(1000))
    balance = Column(Numeric(15, 2), nullable=False, default=Decimal('0.00'))
    currency = Column(String(3), default='USD', nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    transfers_outgoing = relationship(
        'Transfer',
        foreign_keys='Transfer.ingress_id',
        backref='ingress_account',
        cascade='all, delete-orphan'
    )
    transfers_incoming = relationship(
        'Transfer',
        foreign_keys='Transfer.egress_id',
        backref='egress_account',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f"<Account {self.name} ({self.id})>"


class Source(Base):
    """Source entity - represents an external entity that provides money."""
    __tablename__ = "sources"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(String(1000))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    transfers = relationship(
        'Transfer',
        foreign_keys='Transfer.ingress_id',
        backref='source',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f"<Source {self.name} ({self.id})>"


class Sink(Base):
    """Sink entity - represents an external entity that receives money."""
    __tablename__ = "sinks"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(String(1000))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    transfers = relationship(
        'Transfer',
        foreign_keys='Transfer.egress_id',
        backref='sink',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f"<Sink {self.name} ({self.id})>"


class Category(Base):
    """Category entity - for organizing/tagging transfers."""
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(String(1000))
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    transfers = relationship('Transfer', backref='category', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Category {self.name} ({self.id})>"


class Transfer(Base):
    """
    Transfer entity - represents a transaction between entities.
    
    Supports reclaimable transfers:
    - Account → Sink transfers can be marked as reclaimable
    - Source → Account transfers can reference reclaimable transfers
    
    Fields:
    - is_reclaimable: If true, this Account→Sink transfer expects recovery
    - reclaimable_source_name: Name of the entity expected to recover this transfer
    - reclaimed_by_transfer_id: FK to the recovery transfer (once recovered)
    """
    __tablename__ = "transfers"
    __table_args__ = (
        Index('idx_transfer_date', 'date'),
        Index('idx_transfer_reclaimable_pending', 'is_reclaimable', 'reclaimed_by_transfer_id'),
        Index('idx_transfer_recovery_link', 'reclaimed_by_transfer_id'),
        CheckConstraint("amount > 0", name='ck_transfer_positive_amount'),
        CheckConstraint("ingress_type IN ('account', 'source')", name='ck_transfer_valid_ingress'),
        CheckConstraint("egress_type IN ('account', 'sink')", name='ck_transfer_valid_egress'),
    )

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    
    # Transfer metadata
    date = Column(DateTime, nullable=False, index=True)
    amount = Column(Numeric(15, 2), nullable=False)
    currency = Column(String(3), default='USD', nullable=False)
    description = Column(String(1000))
    
    # Ingress (source of money)
    ingress_type = Column(String(20), nullable=False)  # 'account' or 'source'
    ingress_id = Column(String, nullable=False, index=True)
    
    # Egress (destination of money)
    egress_type = Column(String(20), nullable=False)  # 'account' or 'sink'
    egress_id = Column(String, nullable=False, index=True)
    
    # Reclaimable transfer feature
    is_reclaimable = Column(Boolean, default=False, nullable=False)
    reclaimable_source_name = Column(String(255), nullable=True)  # Required if is_reclaimable=true
    reclaimed_by_transfer_id = Column(
        String,
        ForeignKey('transfers.id', ondelete='SET NULL'),
        nullable=True,
        unique=True  # Ensure one-to-one: only ONE recovery per reclaimable transfer
    )
    
    # Category (optional)
    category_id = Column(String, ForeignKey('categories.id', ondelete='SET NULL'), nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Self-referential relationship for recovery linking
    recovery_transfer = relationship(
        'Transfer',
        remote_side=[id],
        foreign_keys=[reclaimed_by_transfer_id],
        backref='original_transfer',
        uselist=False
    )
    
    # Relationships with foreign key columns
    uploads = relationship('Upload', backref='transfer', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Transfer {self.id} {self.ingress_type}→{self.egress_type} {self.amount} {self.currency}>"


class Upload(Base):
    """
    Upload entity - stores proof-of-transaction files.
    Files are stored in S3 or local filesystem in structure: {YYYY-MM-DD}/{HH}/{uuid}.{extension}
    """
    __tablename__ = "uploads"
    __table_args__ = (
        Index('idx_upload_transfer', 'transfer_id'),
        Index('idx_upload_date', 'uploaded_at'),
    )

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    
    # Transfer reference
    transfer_id = Column(String, ForeignKey('transfers.id', ondelete='CASCADE'), nullable=False)
    
    # File metadata
    file_name = Column(String(255), nullable=False)  # Original filename
    storage_key = Column(String(500), nullable=False)  # Path in S3/local: YYYY-MM-DD/HH/uuid.ext
    file_size = Column(Numeric(15, 0), nullable=False)  # Bytes
    mime_type = Column(String(100), nullable=False)
    
    # Metadata
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    def __repr__(self):
        return f"<Upload {self.id} {self.file_name} ({self.storage_key})>"
