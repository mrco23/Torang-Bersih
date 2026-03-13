"""Artikel service - Business logic for artikel"""
import re
import uuid
from sqlalchemy import or_

from app.config.extensions import db
from app.database.models import Artikel, StatusPublikasi, RefKategoriArtikel
from app.database.models.artikel import ArtikelLike, ArtikelKomentar, StatusKomentar
from app.utils.exceptions import NotFoundError, ForbiddenError, BadRequestError

class ArtikelService:
    @staticmethod
    def get_all(page=1, per_page=20, search=None, sort_by='created_at', sort_order='desc'):
        query = Artikel.query

        if search:
            query = query.filter(
                or_(
                    Artikel.judul_artikel.ilike(f'%{search}%'),
                    Artikel.konten_teks.ilike(f'%{search}%'),
                )
            )

        # Sorting logic
        sort_column = getattr(Artikel, sort_by, Artikel.created_at)
        if sort_order == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        # Pagination logic
        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()

        return items, total

    @staticmethod
    def get_by_id(item_id):
        item = db.session.get(Artikel, item_id)
        if not item:
            raise NotFoundError("Artikel tidak ditemukan")
        return item

    @staticmethod
    def create(user, data):
        # Validate kategori exists & active
        ref = db.session.get(RefKategoriArtikel, data['kategori_id'])
        if not ref or not ref.is_active:
            raise NotFoundError("Kategori artikel tidak valid")

        # Auto-generate slug jika tidak ada
        if not data.get('slug'):
            base_slug = re.sub(r'[^a-zA-Z0-9]+', '-', data['judul_artikel'].lower()).strip('-')
            data['slug'] = f"{base_slug}-{str(uuid.uuid4())[:8]}"

        # Handle Enum conversion (String to Python Enum)
        if 'status_publikasi' in data and isinstance(data['status_publikasi'], str):
            try:
                data['status_publikasi'] = StatusPublikasi(data['status_publikasi'].lower())
            except ValueError:
                data['status_publikasi'] = StatusPublikasi.DRAFT

        item = Artikel(id_penulis=user.id, **data)
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def update(item_id, user, data):
        item = db.session.get(Artikel, item_id)
        if not item:
            raise NotFoundError("Artikel tidak ditemukan")

        # Otorisasi: Hanya pemilik atau Admin yang bisa update
        if item.id_penulis != user.id and not getattr(user, 'is_admin', False):
            raise ForbiddenError("Tidak memiliki akses untuk mengubah artikel ini")

        if 'kategori_id' in data:
            ref = db.session.get(RefKategoriArtikel, data['kategori_id'])
            if not ref or not ref.is_active:
                raise NotFoundError("Kategori artikel tidak valid")

        # Jika status dipublish, pastikan konten tidak kosong (pakai konten baru atau existing)
        if 'status_publikasi' in data:
            status_val = data.get('status_publikasi')
            # status_val bisa Enum atau string (akan dikonversi di bawah), normalisasi dulu
            status_str = status_val.value if hasattr(status_val, "value") else str(status_val or "").lower()
            if status_str == StatusPublikasi.PUBLISHED.value:
                konten = data.get('konten_teks')
                if konten is None:
                    konten = item.konten_teks
                if konten is None or str(konten).strip() == "":
                    raise BadRequestError("konten_teks wajib diisi jika status_publikasi=published")

        for key, value in data.items():
            # Handle Enum conversion khusus status_publikasi
            if key == 'status_publikasi' and isinstance(value, str):
                try:
                    value = StatusPublikasi(value.lower())
                except ValueError:
                    continue
            setattr(item, key, value)

        db.session.commit()
        return item

    @staticmethod
    def delete(item_id, user):
        item = db.session.get(Artikel, item_id)
        if not item:
            raise NotFoundError("Artikel tidak ditemukan")

        # Otorisasi: Hanya pemilik atau Admin yang bisa hapus
        if item.id_penulis != user.id and not getattr(user, 'is_admin', False):
            raise ForbiddenError("Tidak memiliki akses untuk menghapus artikel ini")

        db.session.delete(item)
        db.session.commit()

    @staticmethod
    def get_my_artikel(user_id, page=1, per_page=20, search=None, sort_by='created_at', sort_order='desc'):
        query = Artikel.query.filter_by(id_penulis=user_id)

        if search:
            query = query.filter(
                or_(
                    Artikel.judul_artikel.ilike(f'%{search}%'),
                    Artikel.konten_teks.ilike(f'%{search}%'),
                )
            )

        sort_column = getattr(Artikel, sort_by, Artikel.created_at)
        query = query.order_by(sort_column.asc() if sort_order == 'asc' else sort_column.desc())

        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()

        return items, total

    # ------------------------------------------------------------------ #
    #  LIKE
    # ------------------------------------------------------------------ #
    @staticmethod
    def toggle_like(artikel_id, user):
        """Toggle like untuk artikel. Return (liked: bool, jumlah_like: int)."""
        artikel = db.session.get(Artikel, artikel_id)
        if not artikel:
            raise NotFoundError("Artikel tidak ditemukan")

        existing = ArtikelLike.query.filter_by(
            id_artikel=artikel_id,
            id_user=user.id
        ).first()

        if existing:
            db.session.delete(existing)
            db.session.commit()
            liked = False
        else:
            new_like = ArtikelLike(id_artikel=artikel_id, id_user=user.id)
            db.session.add(new_like)
            db.session.commit()
            liked = True

        jumlah_like = ArtikelLike.query.filter_by(id_artikel=artikel_id).count()
        return liked, jumlah_like

    # ------------------------------------------------------------------ #
    #  KOMENTAR
    # ------------------------------------------------------------------ #
    @staticmethod
    def get_komentar(artikel_id, page=1, per_page=20):
        """Ambil semua komentar aktif top-level untuk satu artikel."""
        artikel = db.session.get(Artikel, artikel_id)
        if not artikel:
            raise NotFoundError("Artikel tidak ditemukan")

        query = ArtikelKomentar.query.filter_by(
            id_artikel=artikel_id,
            parent_id=None,
            status_komentar=StatusKomentar.AKTIF
        ).order_by(ArtikelKomentar.waktu_komentar.asc())

        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()
        return items, total

    @staticmethod
    def create_komentar(artikel_id, user, data):
        """Buat komentar baru atau reply."""
        artikel = db.session.get(Artikel, artikel_id)
        if not artikel:
            raise NotFoundError("Artikel tidak ditemukan")

        # Validasi parent_id jika ada (untuk reply)
        parent_id = data.get('parent_id')
        if parent_id:
            parent = db.session.get(ArtikelKomentar, parent_id)
            if not parent or parent.id_artikel != artikel_id:
                raise NotFoundError("Komentar parent tidak ditemukan")

        komentar = ArtikelKomentar(
            id_artikel=artikel_id,
            id_user=user.id,
            isi_komentar=data['isi_komentar'],
            parent_id=parent_id
        )
        db.session.add(komentar)
        db.session.commit()
        return komentar

    @staticmethod
    def update_komentar(komentar_id, user, data):
        """Edit komentar milik sendiri."""
        komentar = db.session.get(ArtikelKomentar, komentar_id)
        if not komentar:
            raise NotFoundError("Komentar tidak ditemukan")

        if komentar.id_user != user.id and not getattr(user, 'is_admin', False):
            raise ForbiddenError("Tidak memiliki akses untuk mengubah komentar ini")

        komentar.isi_komentar = data['isi_komentar']
        db.session.commit()
        return komentar

    @staticmethod
    def delete_komentar(komentar_id, user):
        """Hapus komentar (owner atau admin)."""
        komentar = db.session.get(ArtikelKomentar, komentar_id)
        if not komentar:
            raise NotFoundError("Komentar tidak ditemukan")

        if komentar.id_user != user.id and not getattr(user, 'is_admin', False):
            raise ForbiddenError("Tidak memiliki akses untuk menghapus komentar ini")

        db.session.delete(komentar)
        db.session.commit()
