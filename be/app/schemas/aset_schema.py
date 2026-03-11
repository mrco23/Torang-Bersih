"""Aset validation schemas"""
from typing import Required
from marshmallow import Schema, fields, validate


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
    pictures_urls = fields.List(fields.String())


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
    pictures_urls = fields.List(fields.String())
    existing_pictures = fields.List(fields.String(), required=False)


class AsetQuerySchema(Schema):
    page = fields.Integer(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100))
    search = fields.String(validate=validate.Length(max=100))
    kategori_aset_id = fields.String()
    kabupaten_kota = fields.String()
    status_aktif = fields.Boolean()
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'nama_aset']))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc']))


class AsetVerifySchema(Schema):
    status_verifikasi = fields.String(
        required=True,
        validate=validate.OneOf(['terverifikasi', 'ditolak'])
    )
    catatan_verifikasi = fields.String(validate=validate.Length(max=1000))
