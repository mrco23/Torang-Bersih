"""Marketplace service - Business logic for marketplace daur ulang"""
from sqlalchemy import or_

from app.config.extensions import db
from app.database.models import (
    MarketplaceDaurUlang, KondisiBarang, StatusKetersediaan, RefKategoriBarang
)
from app.utils.exceptions import NotFoundError, ForbiddenError, ConflictError


class MarketplaceService:

    @staticmethod
    def precheck_create(user, data):
        """Validasi sebelum upload file: cek referensi + duplikasi."""
        ref = db.session.get(RefKategoriBarang, data['kategori_barang_id'])
        if not ref or not ref.is_active:
            raise NotFoundError("Kategori barang tidak valid")

        nama = data['nama_barang'].strip()
        kota = (data.get('kabupaten_kota') or '').strip()
        query = MarketplaceDaurUlang.query.filter(
            MarketplaceDaurUlang.id_penjual == user.id,
            db.func.lower(MarketplaceDaurUlang.nama_barang) == nama.lower()
        )
        if kota:
            query = query.filter(db.func.lower(MarketplaceDaurUlang.kabupaten_kota) == kota.lower())
        existing = query.first()
        if existing:
            raise ConflictError("Nama barang sudah digunakan pada lokasi yang sama")

        data['nama_barang'] = nama
        if kota:
            data['kabupaten_kota'] = kota
        return data

    @staticmethod
    def precheck_update(item_id, user, data):
        """Validasi sebelum upload file saat update: cek akses + referensi + duplikasi."""
        item = db.session.get(MarketplaceDaurUlang, item_id)
        if not item:
            raise NotFoundError("Barang tidak ditemukan")

        if item.id_penjual != user.id and not user.is_admin:
            raise ForbiddenError("Tidak memiliki akses untuk mengubah barang ini")

        if 'kategori_barang_id' in data:
            ref = db.session.get(RefKategoriBarang, data['kategori_barang_id'])
            if not ref or not ref.is_active:
                raise NotFoundError("Kategori barang tidak valid")

        if 'nama_barang' in data and data['nama_barang'] is not None:
            data['nama_barang'] = data['nama_barang'].strip()
        if 'kabupaten_kota' in data and data['kabupaten_kota'] is not None:
            data['kabupaten_kota'] = data['kabupaten_kota'].strip()

        if 'nama_barang' in data or 'kabupaten_kota' in data:
            nama = (data.get('nama_barang') if 'nama_barang' in data else item.nama_barang).strip()
            kota = (data.get('kabupaten_kota') if 'kabupaten_kota' in data else (item.kabupaten_kota or '')).strip()
            query = MarketplaceDaurUlang.query.filter(
                MarketplaceDaurUlang.id_penjual == item.id_penjual,
                db.func.lower(MarketplaceDaurUlang.nama_barang) == nama.lower(),
                MarketplaceDaurUlang.id != item.id
            )
            if kota:
                query = query.filter(db.func.lower(MarketplaceDaurUlang.kabupaten_kota) == kota.lower())
            existing = query.first()
            if existing:
                raise ConflictError("Nama barang sudah digunakan pada lokasi yang sama")

        return item, data

    @staticmethod
    def get_all(page=1, per_page=20, search=None, kategori_barang_id=None,
                kondisi=None, status_ketersediaan=None, kabupaten_kota=None,
                sort_by='created_at', sort_order='desc'):
        query = MarketplaceDaurUlang.query

        if search:
            query = query.filter(
                or_(
                    MarketplaceDaurUlang.nama_barang.ilike(f'%{search}%'),
                    MarketplaceDaurUlang.deskripsi_barang.ilike(f'%{search}%'),
                )
            )

        if kategori_barang_id:
            query = query.filter_by(kategori_barang_id=kategori_barang_id)

        if kondisi:
            query = query.filter(MarketplaceDaurUlang.kondisi==KondisiBarang(kondisi))

        if status_ketersediaan:
            query = query.filter(MarketplaceDaurUlang.status_ketersediaan==StatusKetersediaan(status_ketersediaan))

        if kabupaten_kota:
            query = query.filter(MarketplaceDaurUlang.kabupaten_kota.ilike(f'%{kabupaten_kota}%'))

        sort_column = getattr(MarketplaceDaurUlang, sort_by, MarketplaceDaurUlang.created_at)
        if sort_order == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()
        return items, total

    @staticmethod
    def get_by_id(item_id):
        item = db.session.get(MarketplaceDaurUlang, item_id)
        if not item:
            raise NotFoundError("Barang tidak ditemukan")
        return item

    @staticmethod
    def create(user, data):
        MarketplaceService.precheck_create(user, data)
        item = MarketplaceDaurUlang(id_penjual=user.id, **data)
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def update(item_id, user, data):
        item = db.session.get(MarketplaceDaurUlang, item_id)
        if not item:
            raise NotFoundError("Barang tidak ditemukan")

        if item.id_penjual != user.id and not user.is_admin:
            raise ForbiddenError("Tidak memiliki akses untuk mengubah barang ini")

        if 'kategori_barang_id' in data:
            ref = db.session.get(RefKategoriBarang, data['kategori_barang_id'])
            if not ref or not ref.is_active:
                raise NotFoundError("Kategori barang tidak valid")

        # Normalize & duplicate check if nama/kota changed
        if 'nama_barang' in data and data['nama_barang'] is not None:
            data['nama_barang'] = data['nama_barang'].strip()
        if 'kabupaten_kota' in data and data['kabupaten_kota'] is not None:
            data['kabupaten_kota'] = data['kabupaten_kota'].strip()
        if 'nama_barang' in data or 'kabupaten_kota' in data:
            nama = (data.get('nama_barang') if 'nama_barang' in data else item.nama_barang).strip()
            kota = (data.get('kabupaten_kota') if 'kabupaten_kota' in data else (item.kabupaten_kota or '')).strip()
            query = MarketplaceDaurUlang.query.filter(
                MarketplaceDaurUlang.id_penjual == item.id_penjual,
                db.func.lower(MarketplaceDaurUlang.nama_barang) == nama.lower(),
                MarketplaceDaurUlang.id != item.id
            )
            if kota:
                query = query.filter(db.func.lower(MarketplaceDaurUlang.kabupaten_kota) == kota.lower())
            existing = query.first()
            if existing:
                raise ConflictError("Nama barang sudah digunakan pada lokasi yang sama")

        for key, value in data.items():
            setattr(item, key, value)

        db.session.commit()
        return item

    @staticmethod
    def delete(item_id, user):
        item = db.session.get(MarketplaceDaurUlang, item_id)
        if not item:
            raise NotFoundError("Barang tidak ditemukan")

        if item.id_penjual != user.id and not user.is_admin:
            raise ForbiddenError("Tidak memiliki akses untuk menghapus barang ini")

        db.session.delete(item)
        db.session.commit()

    @staticmethod
    def update_ketersediaan(item_id, user, status_str):
        from datetime import datetime, timezone as tz

        item = db.session.get(MarketplaceDaurUlang, item_id)
        if not item:
            raise NotFoundError("Barang tidak ditemukan")

        if item.id_penjual != user.id and not user.is_admin:
            raise ForbiddenError("Tidak memiliki akses untuk mengubah ketersediaan barang ini")

        item.status_ketersediaan = StatusKetersediaan(status_str)
        
        db.session.commit()
        return item


    @staticmethod
    def get_my_marketplace(user_id, page=1, per_page=20, search=None, kategori_barang_id=None,
                kondisi=None, status_ketersediaan=None, kabupaten_kota=None, sort_by='created_at', sort_order='desc'):
        query = MarketplaceDaurUlang.query.filter_by(id_penjual=user_id)

        if search:
            query = query.filter(
                or_(
                    MarketplaceDaurUlang.nama_barang.ilike(f'%{search}%'),
                    MarketplaceDaurUlang.deskripsi_barang.ilike(f'%{search}%'),
                )
            )

        if kategori_barang_id:
            query = query.filter_by(kategori_barang_id=kategori_barang_id)

        if kondisi:
            query = query.filter(MarketplaceDaurUlang.kondisi==KondisiBarang(kondisi))

        if status_ketersediaan:
            query = query.filter(MarketplaceDaurUlang.status_ketersediaan==StatusKetersediaan(status_ketersediaan))

        if kabupaten_kota:
            query = query.filter(MarketplaceDaurUlang.kabupaten_kota.ilike(f'%{kabupaten_kota}%'))

        sort_column = getattr(MarketplaceDaurUlang, sort_by, MarketplaceDaurUlang.created_at)
        if sort_order == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()
        return items, total