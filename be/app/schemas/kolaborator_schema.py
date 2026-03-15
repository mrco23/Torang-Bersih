"""Kolaborator validation schemas"""
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


class KolaboratorCreateSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    nama_organisasi = fields.String(required=True, validate=validate.Length(min=1, max=100, error="Nama organisasi harus antara 1 sampai 100 karakter"), error_messages={"required": "Nama organisasi harus diisi"})
    jenis_kolaborator_id = fields.String(required=True, error_messages={"required": "Jenis kolaborator harus dipilih"})
    deskripsi = fields.String(validate=validate.Length(min=50, error="Deskripsi minimal 50 karakter"))
    logo_url = fields.String(validate=validate.Length(max=500, error="URL logo maksimal 500 karakter"))
    email = fields.Email(error_messages={"invalid": "Format email tidak valid"})
    kabupaten_kota = fields.String(validate=validate.Length(max=100, error="Nama kabupaten/kota maksimal 100 karakter"))
    alamat_lengkap = fields.String()
    latitude = fields.Float(error_messages={"invalid": "Format latitude tidak valid"})
    longitude = fields.Float(error_messages={"invalid": "Format longitude tidak valid"})
    penanggung_jawab = fields.String(validate=validate.Length(max=100, error="Nama penanggung jawab maksimal 100 karakter"))
    kontak = fields.String(validate=validate.Length(max=20, error="Kontak maksimal 20 karakter"))
    sosmed = fields.String(validate=validate.Length(max=500, error="URL media sosial maksimal 500 karakter"))


    @validates_schema
    def validate_location_and_contact(self, data, **kwargs):
        _validate_lat_lng_pair_and_range(data)
        # Minimal salah satu metode kontak
        email = data.get("email")
        kontak = data.get("kontak")
        if not email and not kontak:
            raise ValidationError("Minimal salah satu dari email atau kontak harus diisi", field_name="email")


class KolaboratorUpdateSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    nama_organisasi = fields.String(validate=validate.Length(min=1, max=100, error="Nama organisasi harus antara 1 sampai 100 karakter"))
    jenis_kolaborator_id = fields.String()
    deskripsi = fields.String(validate=validate.Length(min=50, error="Deskripsi minimal 50 karakter"))
    logo_url = fields.String(validate=validate.Length(max=500, error="URL logo maksimal 500 karakter"))
    email = fields.Email(error_messages={"invalid": "Format email tidak valid"})
    kabupaten_kota = fields.String(validate=validate.Length(max=100, error="Nama kabupaten/kota maksimal 100 karakter"))
    alamat_lengkap = fields.String()
    latitude = fields.Float(error_messages={"invalid": "Format latitude tidak valid"})
    longitude = fields.Float(error_messages={"invalid": "Format longitude tidak valid"})
    penanggung_jawab = fields.String(validate=validate.Length(max=100, error="Nama penanggung jawab maksimal 100 karakter"))
    kontak = fields.String(validate=validate.Length(max=20, error="Kontak maksimal 20 karakter"))
    sosmed = fields.String(validate=validate.Length(max=500, error="URL media sosial maksimal 500 karakter"))


    @validates_schema
    def validate_location_pair(self, data, **kwargs):
        _validate_lat_lng_pair_and_range(data)


class KolaboratorQuerySchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    page = fields.Integer(load_default=1, validate=validate.Range(min=1, error="Halaman minimal 1"))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100, error="Per halaman antara 1 sampai 100"))
    search = fields.String(validate=validate.Length(max=100, error="Pencarian maksimal 100 karakter"))
    jenis_kolaborator_id = fields.String()
    kabupaten_kota = fields.String()
    status_aktif = fields.Boolean(error_messages={"invalid": "Format status aktif tidak valid"})
    status_verifikasi = fields.String(validate=validate.OneOf(['menunggu', 'terverifikasi', 'ditolak'], error="Status verifikasi tidak valid"))
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'nama_organisasi'], error="Penyortiran tidak valid"))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc'], error="Urutan penyortiran harus 'asc' atau 'desc'"))




class KolaboratorVerifySchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    status_verifikasi = fields.String(
        required=True,
        validate=validate.OneOf(['terverifikasi', 'ditolak'], error="Status verifikasi harus 'terverifikasi' atau 'ditolak'"),
        error_messages={"required": "Status verifikasi harus diisi"}
    )
    catatan_verifikasi = fields.String(validate=validate.Length(max=1000, error="Catatan verifikasi maksimal 1000 karakter"))

