"""Peta service - Combined map markers from all entities"""
from app.database.models import (
    Kolaborator, Aset, LaporanSampahIlegal,
    MarketplaceDaurUlang
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
                Kolaborator.longitude.isnot(None)
            ).all()
            for item in items:
                markers.append({
                    'id': item.id,
                    'name': item.nama_organisasi,
                    'lat': item.latitude,
                    'lng': item.longitude,
                    'type': 'Kolaborator',
                    'status': 'Terverifikasi' if item.status_verifikasi else 'Belum Verifikasi',
                    'image_url': item.logo_url,
                    'detail': {
                        'kabupaten_kota': item.kabupaten_kota,
                        'jenis': item.jenis_ref.nama if item.jenis_ref else None,
                    }
                })

        if 'Aset' in types:
            items = Aset.query.filter(
                Aset.latitude.isnot(None),
                Aset.longitude.isnot(None)
            ).all()
            for item in items:
                markers.append({
                    'id': item.id,
                    'name': item.nama_aset,
                    'lat': item.latitude,
                    'lng': item.longitude,
                    'type': 'Aset',
                    'status': 'Aktif' if item.status_aktif else 'Nonaktif',
                    'image_url': item.pictures_urls[0] if item.pictures_urls and len(item.pictures_urls) > 0 else None,
                    'detail': {
                        'kabupaten_kota': item.kabupaten_kota,
                        'kategori': item.kategori_ref.nama if item.kategori_ref else None,
                    }
                })

        if 'Laporan Sampah' in types:
            items = LaporanSampahIlegal.query.filter(
                LaporanSampahIlegal.latitude.isnot(None),
                LaporanSampahIlegal.longitude.isnot(None)
            ).all()
            for item in items:
                markers.append({
                    'id': item.id,
                    'name': item.alamat_lokasi or 'Laporan Sampah',
                    'lat': item.latitude,
                    'lng': item.longitude,
                    'type': 'Laporan Sampah',
                    'status': item.status_laporan.value.capitalize() if item.status_laporan else 'Menunggu',
                    'image_url': item.foto_bukti_urls[0] if item.foto_bukti_urls and len(item.foto_bukti_urls) > 0 else None,
                    'detail': {
                        'jenis_sampah': item.jenis_sampah_ref.nama if item.jenis_sampah_ref else None,
                        'estimasi_berat_kg': item.estimasi_berat_kg,
                    }
                })

        if 'Barang Daur Ulang' in types:
            items = MarketplaceDaurUlang.query.filter(
                MarketplaceDaurUlang.latitude.isnot(None),
                MarketplaceDaurUlang.longitude.isnot(None)
            ).all()
            for item in items:
                markers.append({
                    'id': item.id,
                    'name': item.nama_barang,
                    'lat': item.latitude,
                    'lng': item.longitude,
                    'type': 'Barang Daur Ulang',
                    'status': item.status_ketersediaan.value.capitalize() if item.status_ketersediaan else 'Tersedia',
                    'image_url': item.foto_barang_urls[0] if item.foto_barang_urls and len(item.foto_barang_urls) > 0 else None,
                    'detail': {
                        'harga': item.harga,
                        'kondisi': item.kondisi.value if item.kondisi else None,
                    }
                })

        return markers
