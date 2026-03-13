"""Auth validation schemas"""
from marshmallow import Schema, fields, validate, validates, ValidationError
import re


_PASSWORD_MIN_LEN = 8
_PASSWORD_REGEX = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$")


def _validate_password_strength(value: str) -> None:
    if value is None:
        return
    if len(value) < _PASSWORD_MIN_LEN:
        raise ValidationError(f"Password minimal {_PASSWORD_MIN_LEN} karakter")
    if not _PASSWORD_REGEX.match(value):
        raise ValidationError("Password harus mengandung huruf besar, huruf kecil, angka, dan simbol")


class RegisterSchema(Schema):
    email = fields.Email(required=True)
    username = fields.String(required=True, validate=[
        validate.Length(min=3, max=50),
        validate.Regexp(r'^[a-zA-Z0-9_]+$')
    ])
    password = fields.String(required=True, validate=validate.Length(min=_PASSWORD_MIN_LEN), load_only=True)
    full_name = fields.String(required=True, validate=validate.Length(max=100))

    @validates("password")
    def validate_password(self, value, **kwargs):
        _validate_password_strength(value)
    



class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)


class RefreshTokenSchema(Schema):
    refresh_token = fields.String(required=True)


class ForgotPasswordSchema(Schema):
    email = fields.Email(required=True)


class ResetPasswordSchema(Schema):
    token = fields.String(required=True)
    password = fields.String(required=True, validate=validate.Length(min=_PASSWORD_MIN_LEN), load_only=True)

    @validates("password")
    def validate_password(self, value, **kwargs):
        _validate_password_strength(value)
    



class ChangePasswordSchema(Schema):
    current_password = fields.String(required=True, load_only=True)
    new_password = fields.String(required=True, validate=validate.Length(min=_PASSWORD_MIN_LEN), load_only=True)

    @validates("new_password")
    def validate_new_password(self, value, **kwargs):
        _validate_password_strength(value)
    

