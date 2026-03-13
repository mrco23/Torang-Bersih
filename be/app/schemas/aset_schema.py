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
    nama_aset = fields.String(required=True, validate=validate.Length(min=1, max=200))
    kategori_aset_id = fields.String(required=True)
    deskripsi_aset = fields.String()
    status_aktif = fields.Boolean(load_default=True)
    kabupaten_kota = fields.String(validate=validate.Length(max=100))
    alamat_lengkap = fields.String()
    latitude = fields.Float()
    longitude = fields.Float()
    penanggung_jawab = fields.String(validate=validate.Length(max=100))
    kontak = fields.String(validate=validate.Length(max=20))
    pictures_urls = fields.List(fields.String(), validate=validate.Length(max=10))

    @validates_schema
    def validate_location(self, data, **kwargs):
        _validate_lat_lng_pair_and_range(data)


class AsetUpdateSchema(Schema):
    nama_aset = fields.String(validate=validate.Length(min=1, max=200))
    kategori_aset_id = fields.String()
    deskripsi_aset = fields.String()
    status_aktif = fields.Boolean()
    kabupaten_kota = fields.String(validate=validate.Length(max=100))
    alamat_lengkap = fields.String()
    latitude = fields.Float()
    longitude = fields.Float()
    penanggung_jawab = fields.String(validate=validate.Length(max=100))
    kontak = fields.String(validate=validate.Length(max=20))
    pictures_urls = fields.List(fields.String(), validate=validate.Length(max=10))
    existing_pictures = fields.List(fields.String(), required=False)

    @validates_schema
    def validate_location(self, data, **kwargs):
        _validate_lat_lng_pair_and_range(data)


class AsetQuerySchema(Schema):
    page = fields.Integer(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100))
    search = fields.String(validate=validate.Length(max=100))
    kategori_aset_id = fields.String()
    kabupaten_kota = fields.String()
    status_aktif = fields.Boolean()
    status_verifikasi = fields.String(validate=validate.OneOf(['menunggu', 'terverifikasi', 'ditolak']))
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'nama_aset']))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc']))


class AsetVerifySchema(Schema):
    status_verifikasi = fields.String(
        required=True,
        validate=validate.OneOf(['terverifikasi', 'ditolak'])
    )
    catatan_verifikasi = fields.String(validate=validate.Length(max=1000))
