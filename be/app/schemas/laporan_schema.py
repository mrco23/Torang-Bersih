"""Laporan Sampah Ilegal & Tindak Lanjut validation schemas"""
from marshmallow import Schema, fields, validate


class LaporanCreateSchema(Schema):
    foto_bukti_urls = fields.List(fields.String())
    latitude = fields.Float()
    longitude = fields.Float()
    kabupaten_kota = fields.String()
    alamat_lokasi = fields.String()
    jenis_sampah_id = fields.String(required=True)
    estimasi_berat_kg = fields.Float()
    karakteristik = fields.String(validate=validate.OneOf(['bisa_didaur_ulang', 'residu']))
    bentuk_timbulan = fields.String(validate=validate.OneOf(['tercecer', 'menumpuk']))
    deskripsi_laporan = fields.String(validate=validate.Length(max=2000))


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
    estimasi_berat_kg = fields.Float()
    karakteristik = fields.String(validate=validate.OneOf(['bisa_didaur_ulang', 'residu']))
    bentuk_timbulan = fields.String(validate=validate.OneOf(['tercecer', 'menumpuk']))
    deskripsi_laporan = fields.String(validate=validate.Length(max=2000))


class TindakLanjutCreateSchema(Schema):
    tindak_lanjut_penanganan = fields.String(required=True, validate=validate.Length(min=1, max=200))
    tim_penindak = fields.String(validate=validate.Length(max=200))
    foto_sebelum_tindakan_urls = fields.List(fields.String())
    foto_setelah_tindakan_urls = fields.List(fields.String())
    catatan = fields.String()
