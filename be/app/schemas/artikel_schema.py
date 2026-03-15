"""Artikel validation schemas"""
from marshmallow import Schema, fields, validate, validates_schema, ValidationError

from app.database.models.artikel import StatusPublikasi

class ArtikelCreateSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    judul_artikel = fields.String(required=True, validate=validate.Length(min=1, max=255, error="Judul artikel harus antara 1 sampai 255 karakter"), error_messages={"required": "Judul artikel harus diisi"})
    kategori_id = fields.String(required=True, error_messages={"required": "Kategori harus dipilih"})
    konten_teks = fields.String(required=False)
    foto_cover_url = fields.String(required=False)
    status_publikasi = fields.Str(validate=validate.OneOf(['draft', 'published', 'archived'], error="Status publikasi tidak valid"))
    tags = fields.List(fields.String(error_messages={"invalid": "Format tag tidak valid"}), load_default=[])
    is_featured = fields.Boolean(load_default=False, error_messages={"invalid": "Format status unggulan tidak valid"})


    # Aturan business ringan di schema: published harus punya konten
    # (validasi referensi kategori dilakukan di service)
    @validates_schema
    def validate_published_has_content(self, data, **kwargs):
        status = (data.get("status_publikasi") or "").lower()
        konten = data.get("konten_teks")
        if status == "published" and (konten is None or str(konten).strip() == ""):
            raise ValidationError("konten_teks wajib diisi jika status_publikasi=published", field_name="konten_teks")


class ArtikelUpdateSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    judul_artikel = fields.String(validate=validate.Length(min=1, max=255, error="Judul artikel harus antara 1 sampai 255 karakter"))
    kategori_id = fields.String()
    konten_teks = fields.String()
    foto_cover_url = fields.String(validate=validate.Length(max=500, error="URL foto cover maksimal 500 karakter"))
    status_publikasi = fields.String(validate=validate.OneOf([s.value for s in StatusPublikasi], error="Status publikasi tidak valid"))
    tags = fields.List(fields.String(error_messages={"invalid": "Format tag tidak valid"}))
    is_featured = fields.Boolean(error_messages={"invalid": "Format status unggulan tidak valid"})



class ArtikelQuerySchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    page = fields.Integer(load_default=1, validate=validate.Range(min=1, error="Halaman minimal 1"))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100, error="Per halaman antara 1 sampai 100"))
    search = fields.String(validate=validate.Length(max=100, error="Pencarian maksimal 100 karakter"))
    kategori_id = fields.String()
    status_publikasi = fields.String(validate=validate.OneOf([s.value for s in StatusPublikasi], error="Status publikasi tidak valid"))
    tag = fields.String()
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'judul_artikel', 'waktu_publish', 'jumlah_views'], error="Penyortiran tidak valid"))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc'], error="Urutan penyortiran harus 'asc' atau 'desc'"))



class MyArtikelQuerySchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    page = fields.Integer(load_default=1, validate=validate.Range(min=1, error="Halaman minimal 1"))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100, error="Per halaman antara 1 sampai 100"))
    search = fields.String(validate=validate.Length(max=100, error="Pencarian maksimal 100 karakter"))
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'judul_artikel', 'waktu_publish', 'jumlah_views'], error="Penyortiran tidak valid"))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc'], error="Urutan penyortiran harus 'asc' atau 'desc'"))



class ArtikelKomentarCreateSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    isi_komentar = fields.String(required=True, validate=validate.Length(min=1, max=2000, error="Isi komentar harus antara 1 sampai 2000 karakter"), error_messages={"required": "Isi komentar harus diisi"})
    parent_id = fields.String(required=False, allow_none=True)



class ArtikelKomentarUpdateSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    isi_komentar = fields.String(required=True, validate=validate.Length(min=1, max=2000, error="Isi komentar harus antara 1 sampai 2000 karakter"), error_messages={"required": "Isi komentar harus diisi"})



class ArtikelKomentarQuerySchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    page = fields.Integer(load_default=1, validate=validate.Range(min=1, error="Halaman minimal 1"))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100, error="Per halaman antara 1 sampai 100"))

