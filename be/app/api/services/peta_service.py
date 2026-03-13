"""Peta service - Combined map markers from all entities"""
from app.database.models import (
    Kolaborator, Aset, LaporanSampahIlegal,
    MarketplaceDaurUlang,
    StatusVerifikasiKolaborator,
    StatusVerifikasiAset,
    StatusLaporan,
    StatusKetersediaan
)


class PetaService:

    @staticmethod
    def get_markers(types=None):
        """Get map markers from all entity types that have coordinates.
        types: list of strings like ['Kolaborator', 'Aset', 'Laporan Sampah', 'Barang Daur Ulang']
        """
        if types is None:
            types = ['Kolaborator', 'Aset', 'Laporan Sampah', 'Barang Daur Ulang']

        markers = []

        if 'Kolaborator' in types:
            items = Kolaborator.query.filter(
                Kolaborator.latitude.isnot(None),
                Kolaborator.longitude.isnot(None),
                Kolaborator.status_verifikasi == StatusVerifikasiKolaborator("terverifikasi"),
                Kolaborator.status_aktif == True
            ).all()
            for item in items:
                markers.append({
                    'id': item.id,
                    'name': item.nama_organisasi,
                    'lat': item.latitude,
                    'lng': item.longitude,
                    'type': 'Kolaborator',
                    'status': item.status_verifikasi.value if item.status_verifikasi else None,
                    'image_url': item.logo_url,
                    'detail': {
                        'jenis_kolaborator': item.jenis_ref.nama if item.jenis_ref else None,
                        'deskripsi': item.deskripsi,
                        'email': item.email,
                        'kabupaten_kota': item.kabupaten_kota,
                        'alamat_lengkap': item.alamat_lengkap,
                        'penanggung_jawab': item.penanggung_jawab,
                        'kontak': item.kontak,
                        'sosmed': item.sosmed,
                    }
                })

        if 'Aset' in types:
            items = Aset.query.filter(
                Aset.latitude.isnot(None),
                Aset.longitude.isnot(None),
                Aset.status_verifikasi == StatusVerifikasiAset("terverifikasi"),
                Aset.status_aktif == True
            ).all()
            for item in items:
                markers.append({
                    'id': item.id,
                    'name': item.nama_aset,
                    'lat': item.latitude,
                    'lng': item.longitude,
                    'type': 'Aset',
                    'status': item.status_verifikasi.value if item.status_verifikasi else None,
                    'image_url': item.pictures_urls[0] if item.pictures_urls and len(item.pictures_urls) > 0 else None,
                    'detail': {
                        'kategori_aset': item.kategori_ref.nama if item.kategori_ref else None,
                        'deskripsi_aset': item.deskripsi_aset,
                        'kabupaten_kota': item.kabupaten_kota,
                        'alamat_lengkap': item.alamat_lengkap,
                        'penanggung_jawab': item.penanggung_jawab,
                        'kontak': item.kontak,
                    }
                })

        if 'Laporan Sampah' in types:
            items = LaporanSampahIlegal.query.filter(
                LaporanSampahIlegal.latitude.isnot(None),
                LaporanSampahIlegal.longitude.isnot(None),
                LaporanSampahIlegal.status_laporan.in_([StatusLaporan("ditindak"), StatusLaporan("diterima"), StatusLaporan("selesai")])
            ).all()
            for item in items:
                markers.append({
                    'id': item.id,
                    'name': item.alamat_lokasi or 'Laporan Sampah',
                    'lat': item.latitude,
                    'lng': item.longitude,
                    'type': 'Laporan Sampah',
                    'status': item.status_laporan.value if item.status_laporan else None,
                    'image_url': item.foto_bukti_urls[0] if item.foto_bukti_urls and len(item.foto_bukti_urls) > 0 else None,
                    'detail': {
                        'kabupaten_kota': item.kabupaten_kota,
                        'alamat_lokasi': item.alamat_lokasi,
                        'jenis_sampah': item.jenis_sampah_ref.nama if item.jenis_sampah_ref else None,
                        'estimasi_berat_kg': item.estimasi_berat_kg,
                        'karakteristik': item.karakteristik.value if item.karakteristik else None,
                        'bentuk_timbulan': item.bentuk_timbulan.value if item.bentuk_timbulan else None,
                        'deskripsi_laporan': item.deskripsi_laporan,
                        'status_laporan': item.status_laporan.value if item.status_laporan else None,
                        'jumlah_tindak_lanjut': len(item.tindak_lanjut.all()) if item.tindak_lanjut else 0,
                    }
                })

        if 'Barang Daur Ulang' in types:
            items = MarketplaceDaurUlang.query.filter(
                MarketplaceDaurUlang.latitude.isnot(None),
                MarketplaceDaurUlang.longitude.isnot(None),
                MarketplaceDaurUlang.status_ketersediaan == StatusKetersediaan("tersedia")
            ).all()
            for item in items:
                markers.append({
                    'id': item.id,
                    'name': item.nama_barang,
                    'lat': item.latitude,
                    'lng': item.longitude,
                    'type': 'Barang Daur Ulang',
                    'status': item.status_ketersediaan.value if item.status_ketersediaan else None,
                    'image_url': item.foto_barang_urls[0] if item.foto_barang_urls and len(item.foto_barang_urls) > 0 else None,
                    'detail': {
                        'kategori_barang': item.kategori_ref.nama if item.kategori_ref else None,
                        'deskripsi_barang': item.deskripsi_barang,
                        'harga': item.harga,
                        'berat_estimasi_kg': item.berat_estimasi_kg,
                        'kondisi': item.kondisi.value if item.kondisi else None,
                        'kontak': item.kontak,
                        'kabupaten_kota': item.kabupaten_kota,
                        'alamat_lengkap': item.alamat_lengkap,
                        'status_ketersediaan': item.status_ketersediaan.value if item.status_ketersediaan else None,
                    }
                })

        return markers
