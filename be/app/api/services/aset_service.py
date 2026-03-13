"""Aset service - Business logic for aset"""
from sqlalchemy import or_

from app.config.extensions import db
from app.database.models import Aset, RefKategoriAset, StatusVerifikasiAset
from app.utils.exceptions import NotFoundError, ForbiddenError, BadRequestError, ConflictError


class AsetService:

    @staticmethod
    def precheck_create(user, data):
        """Validasi sebelum upload file: cek referensi + duplikasi."""
        ref = db.session.get(RefKategoriAset, data['kategori_aset_id'])
        if not ref or not ref.is_active:
            raise NotFoundError("Kategori aset tidak valid")

        nama = data['nama_aset'].strip()
        kota = (data.get('kabupaten_kota') or '').strip()
        query = Aset.query.filter(
            Aset.id_user == user.id,
            db.func.lower(Aset.nama_aset) == nama.lower()
        )
        if kota:
            query = query.filter(db.func.lower(Aset.kabupaten_kota) == kota.lower())
        existing = query.first()
        if existing:
            raise ConflictError("Nama aset sudah digunakan pada lokasi yang sama")

        data['nama_aset'] = nama
        if kota:
            data['kabupaten_kota'] = kota
        return data

    @staticmethod
    def precheck_update(item_id, user, data):
        """Validasi sebelum upload file saat update: cek akses + referensi + duplikasi."""
        item = db.session.get(Aset, item_id)
        if not item:
            raise NotFoundError("Aset tidak ditemukan")

        if item.id_user != user.id and not user.is_admin:
            raise ForbiddenError("Tidak memiliki akses untuk mengubah aset ini")

        if 'kategori_aset_id' in data:
            ref = db.session.get(RefKategoriAset, data['kategori_aset_id'])
            if not ref or not ref.is_active:
                raise NotFoundError("Kategori aset tidak valid")

        if 'nama_aset' in data and data['nama_aset'] is not None:
            data['nama_aset'] = data['nama_aset'].strip()
        if 'kabupaten_kota' in data and data['kabupaten_kota'] is not None:
            data['kabupaten_kota'] = data['kabupaten_kota'].strip()

        if 'nama_aset' in data or 'kabupaten_kota' in data:
            nama = (data.get('nama_aset') if 'nama_aset' in data else item.nama_aset).strip()
            kota = (data.get('kabupaten_kota') if 'kabupaten_kota' in data else (item.kabupaten_kota or '')).strip()
            query = Aset.query.filter(
                Aset.id_user == item.id_user,
                db.func.lower(Aset.nama_aset) == nama.lower(),
                Aset.id != item.id
            )
            if kota:
                query = query.filter(db.func.lower(Aset.kabupaten_kota) == kota.lower())
            existing = query.first()
            if existing:
                raise ConflictError("Nama aset sudah digunakan pada lokasi yang sama")

        return item, data

    @staticmethod
    def get_all(page=1, per_page=20, search=None, kategori_aset_id=None,
                kabupaten_kota=None, status_aktif=None, status_verifikasi=None, sort_by='created_at', sort_order='desc'):
        query = Aset.query

        if search:
            query = query.filter(
                or_(
                    Aset.nama_aset.ilike(f'%{search}%'),
                    Aset.alamat_lengkap.ilike(f'%{search}%'),
                )
            )

        if kategori_aset_id:
            query = query.filter_by(kategori_aset_id=kategori_aset_id)

        if kabupaten_kota:
            query = query.filter(Aset.kabupaten_kota.ilike(f'%{kabupaten_kota}%'))

        if status_aktif is not None:
            query = query.filter_by(status_aktif=status_aktif)

        if status_verifikasi is not None:
            query = query.filter(Aset.status_verifikasi==StatusVerifikasiAset(status_verifikasi))

        # Sorting
        sort_column = getattr(Aset, sort_by, Aset.created_at)
        if sort_order == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()

        return items, total

    @staticmethod
    def get_by_id(item_id):
        item = db.session.get(Aset, item_id)
        if not item:
            raise NotFoundError("Aset tidak ditemukan")
        return item

    @staticmethod
    def create(user, data):
        AsetService.precheck_create(user, data)
        item = Aset(id_user=user.id, **data)
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def update(item_id, user, data):
        item = db.session.get(Aset, item_id)
        if not item:
            raise NotFoundError("Aset tidak ditemukan")

        if item.id_user != user.id and not user.is_admin:
            raise ForbiddenError("Tidak memiliki akses untuk mengubah aset ini")

        if 'kategori_aset_id' in data:
            ref = db.session.get(RefKategoriAset, data['kategori_aset_id'])
            if not ref or not ref.is_active:
                raise NotFoundError("Kategori aset tidak valid")

        # Duplicate check if nama/kota changed
        if 'nama_aset' in data and data['nama_aset'] is not None:
            data['nama_aset'] = data['nama_aset'].strip()
        if 'kabupaten_kota' in data and data['kabupaten_kota'] is not None:
            data['kabupaten_kota'] = data['kabupaten_kota'].strip()
        if 'nama_aset' in data or 'kabupaten_kota' in data:
            nama = (data.get('nama_aset') if 'nama_aset' in data else item.nama_aset).strip()
            kota = (data.get('kabupaten_kota') if 'kabupaten_kota' in data else (item.kabupaten_kota or '')).strip()
            query = Aset.query.filter(
                Aset.id_user == item.id_user,
                db.func.lower(Aset.nama_aset) == nama.lower(),
                Aset.id != item.id
            )
            if kota:
                query = query.filter(db.func.lower(Aset.kabupaten_kota) == kota.lower())
            existing = query.first()
            if existing:
                raise ConflictError("Nama aset sudah digunakan pada lokasi yang sama")

        for key, value in data.items():
            setattr(item, key, value)

        db.session.commit()
        return item

    @staticmethod
    def delete(item_id, user):
        item = db.session.get(Aset, item_id)
        if not item:
            raise NotFoundError("Aset tidak ditemukan")

        if item.id_user != user.id and not user.is_admin:
            raise ForbiddenError("Tidak memiliki akses untuk menghapus aset ini")

        db.session.delete(item)
        db.session.commit()

    @staticmethod
    def verify(item_id, admin_user, status_str, catatan=None):
        from datetime import datetime, timezone as tz

        item = db.session.get(Aset, item_id)
        if not item:
            raise NotFoundError("Aset tidak ditemukan")

        if item.status_verifikasi != StatusVerifikasiAset.MENUNGGU:
            raise BadRequestError("Aset sudah diverifikasi/ditolak sebelumnya")

        item.status_verifikasi = StatusVerifikasiAset(status_str)
        item.id_admin_verifikator = admin_user.id
        item.catatan_verifikasi = catatan
        item.waktu_verifikasi = datetime.now(tz.utc)
        db.session.commit()

        # Send email notification
        recipient_email = item.user.email
        from app.lib.mailer import send_aset_verified_email, send_aset_rejected_email

        if item.status_verifikasi == StatusVerifikasiAset.TERVERIFIKASI:
            send_aset_verified_email(to=recipient_email, aset=item)
        else:
            send_aset_rejected_email(to=recipient_email, aset=item, catatan=catatan)

        return item

    @staticmethod
    def get_my_aset(user_id, page=1, per_page=20, search=None, kategori_aset_id=None,
                kabupaten_kota=None, status_aktif=None, status_verifikasi=None, sort_by='created_at', sort_order='desc'):
        query = Aset.query.filter_by(id_user=user_id)

        if search:
            query = query.filter(
                or_(
                    Aset.nama_aset.ilike(f'%{search}%'),
                    Aset.alamat_lengkap.ilike(f'%{search}%'),
                )
            )

        if kategori_aset_id:
            query = query.filter_by(kategori_aset_id=kategori_aset_id)

        if kabupaten_kota:
            query = query.filter(Aset.kabupaten_kota.ilike(f'%{kabupaten_kota}%'))

        if status_aktif is not None:
            query = query.filter_by(status_aktif=status_aktif)

        if status_verifikasi is not None:
            query = query.filter(Aset.status_verifikasi==StatusVerifikasiAset(status_verifikasi))

        # Sorting
        sort_column = getattr(Aset, sort_by, Aset.created_at)
        if sort_order == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()

        return items, total
