"""Artikel validation schemas"""
from marshmallow import Schema, fields, validate

from app.database.models.artikel import StatusPublikasi

class ArtikelCreateSchema(Schema):
    judul_artikel = fields.String(required=True, validate=validate.Length(min=1, max=255))
    kategori_id = fields.String(required=True)
    konten_teks = fields.String()
    foto_cover_url = fields.String(validate=validate.Length(max=500))
    status_publikasi = fields.String(validate=validate.OneOf([s.value for s in StatusPublikasi]))


class ArtikelUpdateSchema(Schema):
    judul_artikel = fields.String(validate=validate.Length(min=1, max=255))
    kategori_id = fields.String()
    konten_teks = fields.String()
    foto_cover_url = fields.String(validate=validate.Length(max=500))
    status_publikasi = fields.String(validate=validate.OneOf([s.value for s in StatusPublikasi]))


class ArtikelQuerySchema(Schema):
    search = fields.String(validate=validate.Length(max=100))
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'judul_artikel', 'waktu_publish', 'jumlah_views']))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc']))


class MyArtikelQuerySchema(Schema):
    page = fields.Integer(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100))
    search = fields.String(validate=validate.Length(max=100))
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'judul_artikel', 'waktu_publish', 'jumlah_views']))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc']))
