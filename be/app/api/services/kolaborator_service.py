"""Kolaborator service - Business logic for kolaborator"""
from sqlalchemy import or_

from app.config.extensions import db
from app.database.models import Kolaborator, RefJenisKolaborator, StatusVerifikasiKolaborator
from app.utils.exceptions import NotFoundError, ForbiddenError, BadRequestError


class KolaboratorService:

    @staticmethod
    def get_all(page=1, per_page=20, search=None, jenis_kolaborator_id=None,
                kabupaten_kota=None,status_aktif=None, status_verifikasi=None, sort_by='created_at', sort_order='desc'):
        query = Kolaborator.query

        if search:
            query = query.filter(
                or_(
                    Kolaborator.nama_organisasi.ilike(f'%{search}%'),
                    Kolaborator.deskripsi.ilike(f'%{search}%'),
                )
            )

        if jenis_kolaborator_id:
            query = query.filter_by(jenis_kolaborator_id=jenis_kolaborator_id)

        if kabupaten_kota:
            query = query.filter(Kolaborator.kabupaten_kota.ilike(f'%{kabupaten_kota}%'))

        if status_aktif is not None:
            query = query.filter_by(status_aktif=status_aktif)

        if status_verifikasi:
            query = query.filter(Kolaborator.status_verifikasi == StatusVerifikasiKolaborator(status_verifikasi))

        # Sorting
        sort_column = getattr(Kolaborator, sort_by, Kolaborator.created_at)
        if sort_order == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()

        return items, total

    @staticmethod
    def get_by_id(item_id):
        item = db.session.get(Kolaborator, item_id)
        if not item:
            raise NotFoundError("Kolaborator tidak ditemukan")
        return item

    @staticmethod
    def create(user, data):
        # Validate jenis_kolaborator exists
        ref = db.session.get(RefJenisKolaborator, data['jenis_kolaborator_id'])
        if not ref or not ref.is_active:
            raise NotFoundError("Jenis kolaborator tidak valid")

        item = Kolaborator(id_user=user.id, **data)
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def update(item_id, user, data):
        item = db.session.get(Kolaborator, item_id)
        if not item:
            raise NotFoundError("Kolaborator tidak ditemukan")

        # Only owner or admin can update
        if item.id_user != user.id and not user.is_admin:
            raise ForbiddenError("Tidak memiliki akses untuk mengubah kolaborator ini")

        if 'jenis_kolaborator_id' in data:
            ref = db.session.get(RefJenisKolaborator, data['jenis_kolaborator_id'])
            if not ref or not ref.is_active:
                raise NotFoundError("Jenis kolaborator tidak valid")

        for key, value in data.items():
            setattr(item, key, value)

        db.session.commit()
        return item

    @staticmethod
    def delete(item_id, user):
        item = db.session.get(Kolaborator, item_id)
        if not item:
            raise NotFoundError("Kolaborator tidak ditemukan")

        if item.id_user != user.id and not user.is_admin:
            raise ForbiddenError("Tidak memiliki akses untuk menghapus kolaborator ini")

        db.session.delete(item)
        db.session.commit()

    @staticmethod
    def verify(item_id, admin_user, status_str, catatan=None):
        from datetime import datetime, timezone as tz

        item = db.session.get(Kolaborator, item_id)
        if not item:
            raise NotFoundError("Kolaborator tidak ditemukan")

        if item.status_verifikasi != StatusVerifikasiKolaborator.MENUNGGU:
            raise BadRequestError("Kolaborator sudah diverifikasi/ditolak sebelumnya")

        item.status_verifikasi = StatusVerifikasiKolaborator(status_str)
        item.id_admin_verifikator = admin_user.id
        item.catatan_verifikasi = catatan
        item.waktu_verifikasi = datetime.now(tz.utc)
        db.session.commit()

        # Send email notification
        recipient_email = item.email if item.email else item.user.email
        from app.lib.mailer import send_kolaborator_verified_email, send_kolaborator_rejected_email

        if item.status_verifikasi == StatusVerifikasiKolaborator.TERVERIFIKASI:
            send_kolaborator_verified_email(to=recipient_email, kolaborator=item)
        else:
            send_kolaborator_rejected_email(to=recipient_email, kolaborator=item, catatan=catatan)

        return item

    @staticmethod
    def get_my_kolaborator(user_id, page=1, per_page=20, search=None, jenis_kolaborator_id=None,
                kabupaten_kota=None, status_aktif=None, status_verifikasi=None, sort_by='created_at', sort_order='desc'):
        query = Kolaborator.query.filter_by(id_user=user_id)

        if search:
            query = query.filter(
                or_(
                    Kolaborator.nama_organisasi.ilike(f'%{search}%'),
                    Kolaborator.deskripsi.ilike(f'%{search}%'),
                )
            )

        if jenis_kolaborator_id:
            query = query.filter_by(jenis_kolaborator_id=jenis_kolaborator_id)

        if kabupaten_kota:
            query = query.filter(Kolaborator.kabupaten_kota.ilike(f'%{kabupaten_kota}%'))

        if status_aktif is not None:
            query = query.filter_by(status_aktif=status_aktif)

        if status_verifikasi:
            query = query.filter(Kolaborator.status_verifikasi == StatusVerifikasiKolaborator(status_verifikasi))

        # Sorting
        sort_column = getattr(Kolaborator, sort_by, Kolaborator.created_at)
        if sort_order == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()

        return items, total
