"""Kolaborator validation schemas"""
from marshmallow import Schema, fields, validate


class KolaboratorCreateSchema(Schema):
    nama_organisasi = fields.String(required=True, validate=validate.Length(min=1, max=100))
    jenis_kolaborator_id = fields.String(required=True)
    deskripsi = fields.String(validate=validate.Length(min=50))
    logo_url = fields.String(validate=validate.Length(max=500))
    email = fields.Email()
    kabupaten_kota = fields.String(validate=validate.Length(max=100))
    alamat_lengkap = fields.String()
    latitude = fields.Float()
    longitude = fields.Float()
    penanggung_jawab = fields.String(validate=validate.Length(max=100))
    kontak = fields.String(validate=validate.Length(max=20))
    sosmed = fields.String(validate=validate.Length(max=500))


class KolaboratorUpdateSchema(Schema):
    nama_organisasi = fields.String(validate=validate.Length(min=1, max=100))
    jenis_kolaborator_id = fields.String()
    deskripsi = fields.String(validate=validate.Length(min=50))
    logo_url = fields.String(validate=validate.Length(max=500))
    email = fields.Email()
    kabupaten_kota = fields.String(validate=validate.Length(max=100))
    alamat_lengkap = fields.String()
    latitude = fields.Float()
    longitude = fields.Float()
    penanggung_jawab = fields.String(validate=validate.Length(max=100))
    kontak = fields.String(validate=validate.Length(max=20))
    sosmed = fields.String(validate=validate.Length(max=500))


class KolaboratorQuerySchema(Schema):
    page = fields.Integer(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100))
    search = fields.String(validate=validate.Length(max=100))
    jenis_kolaborator_id = fields.String()
    kabupaten_kota = fields.String()
    status_aktif = fields.Boolean()
    status_verifikasi = fields.String(validate=validate.OneOf(['menunggu', 'terverifikasi', 'ditolak']))
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'nama_organisasi']))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc']))



class KolaboratorVerifySchema(Schema):
    status_verifikasi = fields.String(
        required=True,
        validate=validate.OneOf(['terverifikasi', 'ditolak'])
    )
    catatan_verifikasi = fields.String(validate=validate.Length(max=1000))
