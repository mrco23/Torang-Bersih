"""Referensi validation schemas"""
from marshmallow import Schema, fields, validate


class ReferensiCreateSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    nama = fields.String(required=True, validate=validate.Length(min=1, max=100, error="Nama harus antara 1 sampai 100 karakter"), error_messages={"required": "Nama harus diisi"})



class ReferensiUpdateSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    nama = fields.String(validate=validate.Length(min=1, max=100, error="Nama harus antara 1 sampai 100 karakter"))
    is_active = fields.Boolean(error_messages={"invalid": "Format status aktif tidak valid"})

