"""Laporan Sampah Ilegal & Tindak Lanjut validation schemas"""
from marshmallow import Schema, fields, validate, validates_schema, ValidationError


class LaporanCreateSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    foto_bukti_urls = fields.List(fields.String(error_messages={"invalid": "Format URL foto tidak valid"}), error_messages={"invalid": "Format daftar foto tidak valid"})
    latitude = fields.Float(error_messages={"invalid": "Format latitude tidak valid"})
    longitude = fields.Float(error_messages={"invalid": "Format longitude tidak valid"})
    kabupaten_kota = fields.String()
    alamat_lokasi = fields.String()
    jenis_sampah_id = fields.String(required=True, error_messages={"required": "Jenis sampah harus dipilih"})
    estimasi_berat_kg = fields.Float(validate=validate.Range(min=0, error="Estimasi berat minimal 0 kg"), error_messages={"invalid": "Format estimasi berat tidak valid"})
    karakteristik = fields.String(validate=validate.OneOf(['bisa_didaur_ulang', 'residu'], error="Karakteristik harus 'bisa_didaur_ulang' atau 'residu'"))
    bentuk_timbulan = fields.String(validate=validate.OneOf(['tercecer', 'menumpuk'], error="Bentuk timbulan harus 'tercecer' atau 'menumpuk'"))
    deskripsi_laporan = fields.String(validate=validate.Length(max=2000, error="Deskripsi laporan maksimal 2000 karakter"))


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
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    status_laporan = fields.String(
        required=True,
        validate=validate.OneOf(['ditolak', 'diterima', 'selesai'], error="Status laporan tidak valid"),
        error_messages={"required": "Status laporan harus diisi"}
    )
    catatan_verifikasi = fields.String(validate=validate.Length(max=500, error="Catatan verifikasi maksimal 500 karakter"))



class LaporanQuerySchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    page = fields.Integer(load_default=1, validate=validate.Range(min=1, error="Halaman minimal 1"))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100, error="Per halaman antara 1 sampai 100"))
    search = fields.String(validate=validate.Length(max=100, error="Pencarian maksimal 100 karakter"))
    status_laporan = fields.String(validate=validate.Length(max=100))
    jenis_sampah_id = fields.String()
    id_warga = fields.String()
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'estimasi_berat_kg'], error="Penyortiran tidak valid"))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc'], error="Urutan penyortiran harus 'asc' atau 'desc'"))


class MyLaporanQuerySchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    page = fields.Integer(load_default=1, validate=validate.Range(min=1, error="Halaman minimal 1"))
    per_page = fields.Integer(load_default=20, validate=validate.Range(min=1, max=100, error="Per halaman antara 1 sampai 100"))
    search = fields.String(validate=validate.Length(max=100, error="Pencarian maksimal 100 karakter"))
    status_laporan = fields.String(validate=validate.Length(max=100))
    jenis_sampah_id = fields.String()
    sort_by = fields.String(load_default='created_at', validate=validate.OneOf(['created_at', 'estimasi_berat_kg'], error="Penyortiran tidak valid"))
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc'], error="Urutan penyortiran harus 'asc' atau 'desc'"))



class LaporanUpdateSchema(Schema):
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    foto_bukti_urls = fields.List(fields.String(error_messages={"invalid": "Format URL foto tidak valid"}))
    latitude = fields.Float(error_messages={"invalid": "Format latitude tidak valid"})
    longitude = fields.Float(error_messages={"invalid": "Format longitude tidak valid"})
    kabupaten_kota = fields.String()
    alamat_lokasi = fields.String()
    jenis_sampah_id = fields.String()
    estimasi_berat_kg = fields.Float(validate=validate.Range(min=0, error="Estimasi berat minimal 0 kg"), error_messages={"invalid": "Format estimasi berat tidak valid"})
    karakteristik = fields.String(validate=validate.OneOf(['bisa_didaur_ulang', 'residu'], error="Karakteristik harus 'bisa_didaur_ulang' atau 'residu'"))
    bentuk_timbulan = fields.String(validate=validate.OneOf(['tercecer', 'menumpuk'], error="Bentuk timbulan harus 'tercecer' atau 'menumpuk'"))
    deskripsi_laporan = fields.String(validate=validate.Length(max=2000, error="Deskripsi laporan maksimal 2000 karakter"))


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
    error_messages = {
        "unknown": "Kolom tidak dikenal"
    }
    tindak_lanjut_penanganan = fields.String(required=True, validate=validate.Length(min=5, max=200, error="Tindak lanjut penanganan harus antara 5 sampai 200 karakter"), error_messages={"required": "Tindak lanjut penanganan harus diisi"})
    tim_penindak = fields.String(validate=validate.Length(max=200, error="Nama tim penindak maksimal 200 karakter"))
    foto_sebelum_tindakan_urls = fields.List(fields.String(error_messages={"invalid": "Format URL foto tidak valid"}))
    foto_setelah_tindakan_urls = fields.List(fields.String(error_messages={"invalid": "Format URL foto tidak valid"}))
    catatan = fields.String()

