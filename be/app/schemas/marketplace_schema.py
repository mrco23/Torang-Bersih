"""Marketplace Daur Ulang validation schemas"""
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


class MarketplaceCreateSchema(Schema):
    nama_barang = fields.String(required=True, validate=validate.Length(min=1, max=150))
    kategori_barang_id = fields.String(required=True)
    deskripsi_barang = fields.String()
    harga = fields.Integer(load_default=0, validate=validate.Range(min=0))
    berat_estimasi_kg = fields.Float()
    kondisi = fields.String(required=True, validate=validate.OneOf(['layak_pakai', 'butuh_perbaikan', 'rongsokan']))
    kontak = fields.String(validate=validate.Length(max=20))
    latitude = fields.Float()
    longitude = fields.Float()
    kabupaten_kota = fields.String(validate=validate.Length(max=100))
    alamat_lengkap = fields.String()
    foto_barang_urls = fields.List(fields.String(), validate=validate.Length(max=10))

    @validates_schema
    def validate_location(self, data, **kwargs):
        _validate_lat_lng_pair_and_range(data)


class MarketplaceUpdateSchema(Schema):
    nama_barang = fields.String(validate=validate.Length(min=1, max=150))
    kategori_barang_id = fields.String()
    deskripsi_barang = fields.String()
    harga = fields.Integer(validate=validate.Range(min=0))
    berat_estimasi_kg = fields.Float()
    kondisi = fields.String(validate=validate.OneOf(['layak_pakai', 'butuh_perbaikan', 'rongsokan']))
    kontak = fields.String(validate=validate.Length(max=20))
    latitude = fields.Float()
    longitude = fields.Float()
    kabupaten_kota = fields.String(validate=validate.Length(max=100))
    alamat_lengkap = fields.String()
    foto_barang_urls = fields.List(fields.String(), validate=validate.Length(max=10))
    existing_pictures = fields.List(fields.String(), required=False)

    @validates_schema
    def validate_location(self, data, **kwargs):
        _validate_lat_lng_pair_and_range(data)


class MarketplaceQuerySchema(Schema):
    page = fields.Integer(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100))
    search = fields.String(validate=validate.Length(max=100))
    kategori_barang_id = fields.String()
    kondisi = fields.String(validate=validate.OneOf(['layak_pakai', 'butuh_perbaikan', 'rongsokan']))
    status_ketersediaan = fields.String(validate=validate.OneOf(['tersedia', 'dipesan', 'terjual']))
    kabupaten_kota = fields.String()
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'harga', 'nama_barang']))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc']))

class MarketplaceUpdateKetersediaanSchema(Schema):
    status_ketersediaan = fields.String(required=True, validate=validate.OneOf(['tersedia', 'dipesan', 'terjual']))