"""
SQLAlchemy ORM models.
All models inherit from Base (defined in database.py).

Future models will be defined here with examples like:

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from database import Base


# Example model (uncomment and modify as needed):
# class User(Base):
#     __tablename__ = "users"
#
#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True)
#     created_at = Column(DateTime, default=datetime.utcnow)


# Future models will be defined here
