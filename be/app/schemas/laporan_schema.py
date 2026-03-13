"""Laporan Sampah Ilegal & Tindak Lanjut validation schemas"""
from marshmallow import Schema, fields, validate, validates_schema, ValidationError


class LaporanCreateSchema(Schema):
    foto_bukti_urls = fields.List(fields.String())
    latitude = fields.Float()
    longitude = fields.Float()
    kabupaten_kota = fields.String()
    alamat_lokasi = fields.String()
    jenis_sampah_id = fields.String(required=True)
    estimasi_berat_kg = fields.Float(validate=validate.Range(min=0))
    karakteristik = fields.String(validate=validate.OneOf(['bisa_didaur_ulang', 'residu']))
    bentuk_timbulan = fields.String(validate=validate.OneOf(['tercecer', 'menumpuk']))
    deskripsi_laporan = fields.String(validate=validate.Length(max=2000))

    @validates_schema
    def validate_location(self, data, **kwargs):
        lat = data.get("latitude")
        lng = data.get("longitude")
        alamat = (data.get("alamat_lokasi") or "").strip()

        if (lat is None) ^ (lng is None):
            raise ValidationError("Latitude dan longitude harus diisi bersamaan", field_name="latitude")
        if lat is not None and (lat < -90 or lat > 90):
            raise ValidationError("Latitude harus antara -90 sampai 90", field_name="latitude")
        if lng is not None and (lng < -180 or lng > 180):
            raise ValidationError("Longitude harus antara -180 sampai 180", field_name="longitude")

        # Minimal salah satu: koordinat lengkap atau alamat
        if lat is None and lng is None and not alamat:
            raise ValidationError("Minimal salah satu dari koordinat (latitude & longitude) atau alamat_lokasi harus diisi", field_name="alamat_lokasi")


class LaporanUpdateStatusSchema(Schema):
    status_laporan = fields.String(
        required=True,
        validate=validate.OneOf(['ditolak', 'diterima', 'selesai'])
    )
    catatan_verifikasi = fields.String(validate=validate.Length(max=500))


class LaporanQuerySchema(Schema):
    page = fields.Integer(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100))
    search = fields.String(validate=validate.Length(max=100))
    # Allow comma-separated statuses like "diterima,ditindak,selesai"
    status_laporan = fields.String(validate=validate.Length(max=100))
    jenis_sampah_id = fields.String()
    id_warga = fields.String()
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'estimasi_berat_kg']))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc']))

class MyLaporanQuerySchema(Schema):
    page = fields.Integer(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100))
    search = fields.String(validate=validate.Length(max=100))
    # Allow comma-separated statuses
    status_laporan = fields.String(validate=validate.Length(max=100))
    jenis_sampah_id = fields.String()
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'estimasi_berat_kg']))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc']))


class LaporanUpdateSchema(Schema):
    foto_bukti_urls = fields.List(fields.String())
    latitude = fields.Float()
    longitude = fields.Float()
    kabupaten_kota = fields.String()
    alamat_lokasi = fields.String()
    jenis_sampah_id = fields.String()
    estimasi_berat_kg = fields.Float(validate=validate.Range(min=0))
    karakteristik = fields.String(validate=validate.OneOf(['bisa_didaur_ulang', 'residu']))
    bentuk_timbulan = fields.String(validate=validate.OneOf(['tercecer', 'menumpuk']))
    deskripsi_laporan = fields.String(validate=validate.Length(max=2000))

    @validates_schema
    def validate_location_pair(self, data, **kwargs):
        lat = data.get("latitude")
        lng = data.get("longitude")
        if (lat is None) ^ (lng is None):
            raise ValidationError("Latitude dan longitude harus diisi bersamaan", field_name="latitude")
        if lat is not None and (lat < -90 or lat > 90):
            raise ValidationError("Latitude harus antara -90 sampai 90", field_name="latitude")
        if lng is not None and (lng < -180 or lng > 180):
            raise ValidationError("Longitude harus antara -180 sampai 180", field_name="longitude")


class TindakLanjutCreateSchema(Schema):
    tindak_lanjut_penanganan = fields.String(required=True, validate=validate.Length(min=5, max=200))
    tim_penindak = fields.String(validate=validate.Length(max=200))
    foto_sebelum_tindakan_urls = fields.List(fields.String())
    foto_setelah_tindakan_urls = fields.List(fields.String())
    catatan = fields.String()
