"""Aset validation schemas"""
from marshmallow import Schema, fields, validate, validates_schema, ValidationError


def _validate_lat_lng_pair_and_range(data):
    lat = data.get("latitude")
    lng = data.get("longitude")
    if (lat is None) ^ (lng is None):
        raise ValidationError("Latitude dan longitude harus diisi bersamaan", field_name="latitude")
    if lat is not None and (lat < -90 or lat > 90):
        raise ValidationError("Latitude harus antara -90 sampai 90", field_name="latitude")
    if lng is not None and (lng < -180 or lng > 180):
        raise ValidationError("Longitude harus antara -180 sampai 180", field_name="longitude")


class AsetCreateSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    nama_aset = fields.String(required=True, validate=validate.Length(min=1, max=200, error="Nama aset harus antara 1 sampai 200 karakter"), error_messages={"required": "Nama aset harus diisi"})
    kategori_aset_id = fields.String(required=True, error_messages={"required": "Kategori aset harus dipilih"})
    deskripsi_aset = fields.String()
    status_aktif = fields.Boolean(load_default=True, error_messages={"invalid": "Format status aktif tidak valid"})
    kabupaten_kota = fields.String(validate=validate.Length(max=100, error="Nama kabupaten/kota maksimal 100 karakter"))
    alamat_lengkap = fields.String()
    latitude = fields.Float(error_messages={"invalid": "Format latitude tidak valid"})
    longitude = fields.Float(error_messages={"invalid": "Format longitude tidak valid"})
    penanggung_jawab = fields.String(validate=validate.Length(max=100, error="Nama penanggung jawab maksimal 100 karakter"))
    kontak = fields.String(validate=validate.Length(max=20, error="Kontak maksimal 20 karakter"))
    pictures_urls = fields.List(fields.String(error_messages={"invalid": "Format URL foto tidak valid"}), validate=validate.Length(max=10, error="Maksimal 10 foto"))


    @validates_schema
    def validate_location(self, data, **kwargs):
        _validate_lat_lng_pair_and_range(data)


class AsetUpdateSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    nama_aset = fields.String(validate=validate.Length(min=1, max=200, error="Nama aset harus antara 1 sampai 200 karakter"))
    kategori_aset_id = fields.String()
    deskripsi_aset = fields.String()
    status_aktif = fields.Boolean(error_messages={"invalid": "Format status aktif tidak valid"})
    kabupaten_kota = fields.String(validate=validate.Length(max=100, error="Nama kabupaten/kota maksimal 100 karakter"))
    alamat_lengkap = fields.String()
    latitude = fields.Float(error_messages={"invalid": "Format latitude tidak valid"})
    longitude = fields.Float(error_messages={"invalid": "Format longitude tidak valid"})
    penanggung_jawab = fields.String(validate=validate.Length(max=100, error="Nama penanggung jawab maksimal 100 karakter"))
    kontak = fields.String(validate=validate.Length(max=20, error="Kontak maksimal 20 karakter"))
    pictures_urls = fields.List(fields.String(error_messages={"invalid": "Format URL foto tidak valid"}), validate=validate.Length(max=10, error="Maksimal 10 foto"))
    existing_pictures = fields.List(fields.String(), required=False)


    @validates_schema
    def validate_location(self, data, **kwargs):
        _validate_lat_lng_pair_and_range(data)


class AsetQuerySchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    page = fields.Integer(load_default=1, validate=validate.Range(min=1, error="Halaman minimal 1"))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100, error="Per halaman antara 1 sampai 100"))
    search = fields.String(validate=validate.Length(max=100, error="Pencarian maksimal 100 karakter"))
    kategori_aset_id = fields.String()
    kabupaten_kota = fields.String()
    status_aktif = fields.Boolean(error_messages={"invalid": "Format status aktif tidak valid"})
    status_verifikasi = fields.String(validate=validate.OneOf(['menunggu', 'terverifikasi', 'ditolak'], error="Status verifikasi tidak valid"))
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'nama_aset'], error="Penyortiran tidak valid"))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc'], error="Urutan penyortiran harus 'asc' atau 'desc'"))



class AsetVerifySchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    status_verifikasi = fields.String(
        required=True,
        validate=validate.OneOf(['terverifikasi', 'ditolak'], error="Status verifikasi harus 'terverifikasi' atau 'ditolak'"),
        error_messages={"required": "Status verifikasi harus diisi"}
    )
    catatan_verifikasi = fields.String(validate=validate.Length(max=1000, error="Catatan verifikasi maksimal 1000 karakter"))

