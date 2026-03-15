"""Peta validation schemas"""
from marshmallow import Schema, fields, validate


class PetaQuerySchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    types = fields.String(required=False)