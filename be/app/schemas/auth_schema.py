"""Auth validation schemas"""
from marshmallow import Schema, fields, validate, validates, ValidationError
import re


_PASSWORD_MIN_LEN = 8
_PASSWORD_REGEX = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$")


def _validate_password_strength(value: str) -> None:
    if value is None:
        return
    if len(value) < _PASSWORD_MIN_LEN:
        raise ValidationError(f"Password minimal {_PASSWORD_MIN_LEN} karakter")
    if not _PASSWORD_REGEX.match(value):
        raise ValidationError("Password harus mengandung huruf besar, huruf kecil, dan angka")


class RegisterSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }

    
    email = fields.Email(required=True, error_messages={"required": "Email harus diisi", "invalid": "Format email tidak valid"})

    username = fields.String(required=True, validate=[
        validate.Length(min=3, max=50, error="Username harus antara 3 sampai 50 karakter"),
        validate.Regexp(r'^[a-zA-Z0-9_]+$', error="Username hanya boleh berisi huruf, angka, dan underscore")
    ], error_messages={"required": "Username harus diisi"})
    password = fields.String(required=True, load_only=True, error_messages={"required": "Password harus diisi"})
    full_name = fields.String(required=True, validate=validate.Length(max=100, error="Nama lengkap maksimal 100 karakter"), error_messages={"required": "Nama lengkap harus diisi"})


    @validates("password")
    def validate_password(self, value, **kwargs):
        _validate_password_strength(value)
    



class LoginSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    email = fields.Email(required=True, error_messages={"required": "Email harus diisi", "invalid": "Format email tidak valid"})
    password = fields.String(required=True, load_only=True, error_messages={"required": "Password harus diisi"})



class RefreshTokenSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    refresh_token = fields.String(required=True, error_messages={"required": "Refresh token harus diisi"})



class ForgotPasswordSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    email = fields.Email(required=True, error_messages={"required": "Email harus diisi", "invalid": "Format email tidak valid"})



class ResetPasswordSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    token = fields.String(required=True, error_messages={"required": "Token harus diisi"})
    password = fields.String(required=True, validate=validate.Length(min=_PASSWORD_MIN_LEN, error=f"Password minimal {_PASSWORD_MIN_LEN} karakter"), load_only=True, error_messages={"required": "Password harus diisi"})


    @validates("password")
    def validate_password(self, value, **kwargs):
        _validate_password_strength(value)
    



class ChangePasswordSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    current_password = fields.String(required=True, load_only=True, error_messages={"required": "Password saat ini harus diisi"})
    new_password = fields.String(required=True, validate=validate.Length(min=_PASSWORD_MIN_LEN, error=f"Password baru minimal {_PASSWORD_MIN_LEN} karakter"), load_only=True, error_messages={"required": "Password baru harus diisi"})


    @validates("new_password")
    def validate_new_password(self, value, **kwargs):
        _validate_password_strength(value)
    

