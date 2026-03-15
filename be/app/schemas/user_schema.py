"""User validation schemas"""
from marshmallow import Schema, fields, validate


class UserSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    id = fields.String(dump_only=True)
    email = fields.Email(dump_only=True)
    username = fields.String(dump_only=True)
    full_name = fields.String(dump_only=True)
    avatar_url = fields.String(dump_only=True)
    role = fields.String(dump_only=True)
    is_verified = fields.Boolean(dump_only=True)
    is_active = fields.Boolean(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    last_login_at = fields.DateTime(dump_only=True)



class UpdateUserSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    username = fields.String(validate=[
        validate.Length(min=3, max=50, error="Username harus antara 3 sampai 50 karakter"),
        validate.Regexp(r'^[a-zA-Z0-9_]+$', error="Username hanya boleh berisi huruf, angka, dan underscore")
    ])
    full_name = fields.String(validate=validate.Length(max=100, error="Nama lengkap maksimal 100 karakter"))
    avatar_url = fields.URL(error_messages={"invalid": "Format URL avatar tidak valid"})



class UpdateUserAdminSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    username = fields.String(validate=[
        validate.Length(min=3, max=50, error="Username harus antara 3 sampai 50 karakter"),
        validate.Regexp(r'^[a-zA-Z0-9_]+$', error="Username hanya boleh berisi huruf, angka, dan underscore")
    ])
    email = fields.Email(error_messages={"invalid": "Format email tidak valid"})
    full_name = fields.String(validate=validate.Length(max=100, error="Nama lengkap maksimal 100 karakter"))
    role = fields.String(validate=validate.OneOf(['user', 'admin'], error="Role harus berupa 'user' atau 'admin'"))
    is_verified = fields.Boolean(error_messages={"invalid": "Format status verifikasi tidak valid"})
    is_active = fields.Boolean(error_messages={"invalid": "Format status aktif tidak valid"})



class UserListQuerySchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    page = fields.Integer(load_default=1, validate=validate.Range(min=1, error="Halaman minimal 1"))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100, error="Per halaman antara 1 sampai 100"))
    search = fields.String(validate=validate.Length(max=100, error="Pencarian maksimal 100 karakter"))
    role = fields.String(validate=validate.OneOf(['user', 'admin'], error="Role harus berupa 'user' atau 'admin'"))
    is_verified = fields.Boolean(error_messages={"invalid": "Format status verifikasi tidak valid"})
    is_active = fields.Boolean(error_messages={"invalid": "Format status aktif tidak valid"})
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'username', 'email'], error="Penyortiran hanya berdasarkan created_at, username, atau email"))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc'], error="Urutan penyortiran harus 'asc' atau 'desc'"))

