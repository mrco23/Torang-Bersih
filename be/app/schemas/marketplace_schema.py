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
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    nama_barang = fields.String(required=True, validate=validate.Length(min=1, max=150, error="Nama barang harus antara 1 sampai 150 karakter"), error_messages={"required": "Nama barang harus diisi"})
    kategori_barang_id = fields.String(required=True, error_messages={"required": "Kategori barang harus dipilih"})
    deskripsi_barang = fields.String()
    harga = fields.Integer(load_default=0, validate=validate.Range(min=0, error="Harga minimal 0"), error_messages={"invalid": "Format harga tidak valid"})
    berat_estimasi_kg = fields.Float(error_messages={"invalid": "Format berat estimasi tidak valid"})
    kondisi = fields.String(required=True, validate=validate.OneOf(['layak_pakai', 'butuh_perbaikan', 'rongsokan'], error="Kondisi barang tidak valid"), error_messages={"required": "Kondisi barang harus diisi"})
    kontak = fields.String(validate=validate.Length(max=20, error="Kontak maksimal 20 karakter"))
    latitude = fields.Float(error_messages={"invalid": "Format latitude tidak valid"})
    longitude = fields.Float(error_messages={"invalid": "Format longitude tidak valid"})
    kabupaten_kota = fields.String(validate=validate.Length(max=100, error="Nama kabupaten/kota maksimal 100 karakter"))
    alamat_lengkap = fields.String()
    foto_barang_urls = fields.List(fields.String(error_messages={"invalid": "Format URL foto tidak valid"}), validate=validate.Length(max=10, error="Maksimal 10 foto"))


    @validates_schema
    def validate_location(self, data, **kwargs):
        _validate_lat_lng_pair_and_range(data)


class MarketplaceUpdateSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    nama_barang = fields.String(validate=validate.Length(min=1, max=150, error="Nama barang harus antara 1 sampai 150 karakter"))
    kategori_barang_id = fields.String()
    deskripsi_barang = fields.String()
    harga = fields.Integer(validate=validate.Range(min=0, error="Harga minimal 0"), error_messages={"invalid": "Format harga tidak valid"})
    berat_estimasi_kg = fields.Float(error_messages={"invalid": "Format berat estimasi tidak valid"})
    kondisi = fields.String(validate=validate.OneOf(['layak_pakai', 'butuh_perbaikan', 'rongsokan'], error="Kondisi barang tidak valid"))
    kontak = fields.String(validate=validate.Length(max=20, error="Kontak maksimal 20 karakter"))
    latitude = fields.Float(error_messages={"invalid": "Format latitude tidak valid"})
    longitude = fields.Float(error_messages={"invalid": "Format longitude tidak valid"})
    kabupaten_kota = fields.String(validate=validate.Length(max=100, error="Nama kabupaten/kota maksimal 100 karakter"))
    alamat_lengkap = fields.String()
    foto_barang_urls = fields.List(fields.String(error_messages={"invalid": "Format URL foto tidak valid"}), validate=validate.Length(max=10, error="Maksimal 10 foto"))
    existing_pictures = fields.List(fields.String(), required=False)


    @validates_schema
    def validate_location(self, data, **kwargs):
        _validate_lat_lng_pair_and_range(data)


class MarketplaceQuerySchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    page = fields.Integer(load_default=1, validate=validate.Range(min=1, error="Halaman minimal 1"))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100, error="Per halaman antara 1 sampai 100"))
    search = fields.String(validate=validate.Length(max=100, error="Pencarian maksimal 100 karakter"))
    kategori_barang_id = fields.String()
    kondisi = fields.String(validate=validate.OneOf(['layak_pakai', 'butuh_perbaikan', 'rongsokan'], error="Kondisi barang tidak valid"))
    status_ketersediaan = fields.String(validate=validate.OneOf(['tersedia', 'dipesan', 'terjual'], error="Status ketersediaan tidak valid"))
    kabupaten_kota = fields.String()
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'harga', 'nama_barang'], error="Penyortiran tidak valid"))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc'], error="Urutan penyortiran harus 'asc' atau 'desc'"))


class MarketplaceUpdateKetersediaanSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    status_ketersediaan = fields.String(required=True, validate=validate.OneOf(['tersedia', 'dipesan', 'terjual'], error="Status ketersediaan tidak valid"), error_messages={"required": "Status ketersediaan harus diisi"})