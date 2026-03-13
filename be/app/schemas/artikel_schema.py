"""Artikel validation schemas"""
from marshmallow import Schema, fields, validate, validates_schema, ValidationError

from app.database.models.artikel import StatusPublikasi

class ArtikelCreateSchema(Schema):
    judul_artikel = fields.String(required=True, validate=validate.Length(min=1, max=255))
    kategori_id = fields.String(required=True)
    konten_teks = fields.String(required=False)
    foto_cover_url = fields.String(required=False)
    status_publikasi = fields.Str(validate=validate.OneOf(['draft', 'published', 'archived']))

    # Aturan business ringan di schema: published harus punya konten
    # (validasi referensi kategori dilakukan di service)
    @validates_schema
    def validate_published_has_content(self, data, **kwargs):
        status = (data.get("status_publikasi") or "").lower()
        konten = data.get("konten_teks")
        if status == "published" and (konten is None or str(konten).strip() == ""):
            raise ValidationError("konten_teks wajib diisi jika status_publikasi=published", field_name="konten_teks")


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


class ArtikelKomentarCreateSchema(Schema):
    isi_komentar = fields.String(required=True, validate=validate.Length(min=1, max=2000))
    parent_id = fields.String(required=False, allow_none=True)


class ArtikelKomentarUpdateSchema(Schema):
    isi_komentar = fields.String(required=True, validate=validate.Length(min=1, max=2000))


class ArtikelKomentarQuerySchema(Schema):
    page = fields.Integer(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100))
