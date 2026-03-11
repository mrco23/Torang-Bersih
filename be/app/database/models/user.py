"""User database model"""
import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Enum

from app.config.extensions import db


class UserRole(PyEnum):
    USER = 'user'
    ADMIN = 'admin'


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=True)
    full_name = db.Column(db.String(100), nullable=True)
    avatar_url = db.Column(db.String(500))
    role = db.Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    
    # Social auth
    auth_provider = db.Column(db.String(20), default='local', nullable=False)
    provider_id = db.Column(db.String(255), nullable=True)
    
    verification_token = db.Column(db.String(255))
    verification_token_expires = db.Column(db.DateTime(timezone=True))
    reset_token = db.Column(db.String(255))
    reset_token_expires = db.Column(db.DateTime(timezone=True))
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    last_login_at = db.Column(db.DateTime(timezone=True))
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self, include_sensitive=False):
        data = {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'full_name': self.full_name,
            'avatar_url': self.avatar_url,
            'role': self.role.value,
            'is_verified': self.is_verified,
            'is_active': self.is_active,
            'auth_provider': self.auth_provider,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_login_at': self.last_login_at.isoformat() if self.last_login_at else None
        }
        if include_sensitive:
            data['verification_token'] = self.verification_token
            data['reset_token'] = self.reset_token
        return data
    
    @property
    def is_admin(self):
        return self.role == UserRole.ADMIN