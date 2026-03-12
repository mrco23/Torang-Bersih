"""Marketplace Daur Ulang validation schemas"""
from marshmallow import Schema, fields, validate


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
    foto_barang_urls = fields.List(fields.String())


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
    foto_barang_urls = fields.List(fields.String())
    existing_pictures = fields.List(fields.String(), required=False)


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