"""Laporan service - Business logic for laporan & tindak lanjut"""
from sqlalchemy import or_

from app.config.extensions import db
from app.database.models import (
    LaporanSampahIlegal, StatusLaporan, Karakteristik, BentukTimbulan,
    TindakLanjutLaporan, RefJenisSampah
)
from app.utils.exceptions import NotFoundError, ForbiddenError


class LaporanService:

    @staticmethod
    def get_all(page=1, per_page=20, search=None, status_laporan=None,
                jenis_sampah_id=None, id_warga=None, sort_by='created_at', sort_order='desc'):
        query = LaporanSampahIlegal.query

        if search:
            query = query.filter(
                LaporanSampahIlegal.alamat_lokasi.ilike(f'%{search}%')
            )

        if status_laporan:
            if ',' in status_laporan:
                statuses = [s.strip() for s in status_laporan.split(',')]
                valid_statuses = [StatusLaporan(s) for s in statuses if s in [e.value for e in StatusLaporan]]
                query = query.filter(LaporanSampahIlegal.status_laporan.in_(valid_statuses))
            else:
                try:
                    query = query.filter_by(status_laporan=StatusLaporan(status_laporan))
                except ValueError:
                    # Invalid status
                    pass

        if jenis_sampah_id:
            query = query.filter_by(jenis_sampah_id=jenis_sampah_id)

        if id_warga:
            query = query.filter_by(id_warga=id_warga)

        sort_column = getattr(LaporanSampahIlegal, sort_by, LaporanSampahIlegal.created_at)
        if sort_order == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()
        return items, total

    @staticmethod
    def get_by_id(item_id):
        item = db.session.get(LaporanSampahIlegal, item_id)
        if not item:
            raise NotFoundError("Laporan tidak ditemukan")
        return item

    @staticmethod
    def create(user, data):
        ref = db.session.get(RefJenisSampah, data['jenis_sampah_id'])
        if not ref or not ref.is_active:
            raise NotFoundError("Jenis sampah tidak valid")

        # Convert string enum values
        if 'karakteristik' in data and data['karakteristik']:
            data['karakteristik'] = Karakteristik(data['karakteristik'])
        if 'bentuk_timbulan' in data and data['bentuk_timbulan']:
            data['bentuk_timbulan'] = BentukTimbulan(data['bentuk_timbulan'])

        item = LaporanSampahIlegal(id_warga=user.id, **data)
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def update_status(item_id, status_str, user, catatan_verifikasi=None):
        from datetime import datetime, timezone
        from app.lib.mailer import (
            send_laporan_diterima_email, 
            send_laporan_ditolak_email,
            send_laporan_status_email
        )
        
        item = db.session.get(LaporanSampahIlegal, item_id)
        if not item:
            raise NotFoundError("Laporan tidak ditemukan")

        new_status = StatusLaporan(status_str)
        # Check if status is actually changing
        if item.status_laporan != new_status:
            # Transition rules
            if new_status in [StatusLaporan.DITERIMA, StatusLaporan.DITOLAK]:
                if not user.is_admin:
                    raise ForbiddenError("Hanya admin yang dapat memverifikasi laporan (Diterima/Ditolak)")
                if item.status_laporan != StatusLaporan.MENUNGGU:
                     raise ForbiddenError("Laporan hanya dapat diverifikasi dari status 'menunggu'")
                item.id_admin_verifikator = user.id
                item.waktu_verifikasi = datetime.now(timezone.utc)
                item.catatan_verifikasi = catatan_verifikasi
            
            elif new_status == StatusLaporan.SELESAI:
                if item.status_laporan != StatusLaporan.DITINDAK:
                    raise ForbiddenError("Laporan hanya dapat ditandai 'Selesai' jika sedang dalam status 'Ditindak'")
                
            elif new_status == StatusLaporan.DITINDAK:
                raise ForbiddenError("Status 'Ditindak' diperbarui secara otomatis ketika ada tindak lanjut, tidak dapat diperbarui manual")

            item.status_laporan = new_status
            db.session.commit()
            
            # Send specific email based on status
            if item.pelapor and item.pelapor.email:
                if new_status == StatusLaporan.DITERIMA:
                    send_laporan_diterima_email(to=item.pelapor.email, laporan=item)
                elif new_status == StatusLaporan.DITOLAK:
                    send_laporan_ditolak_email(to=item.pelapor.email, laporan=item, catatan=catatan_verifikasi)
                elif new_status == StatusLaporan.SELESAI:
                    send_laporan_status_email(to=item.pelapor.email, laporan=item)
        
        return item

    @staticmethod
    def update(item_id, user, data):
        item = db.session.get(LaporanSampahIlegal, item_id)
        if not item:
            raise NotFoundError("Laporan tidak ditemukan")

        # Only owner or admin can update
        if item.id_warga != user.id and not user.is_admin:
            raise ForbiddenError("Tidak memiliki akses untuk mengubah laporan ini")

        if 'jenis_sampah_id' in data:
            ref = db.session.get(RefJenisSampah, data['jenis_sampah_id'])
            if not ref or not ref.is_active:
                raise NotFoundError("Jenis sampah tidak valid")

        # Convert string enum values
        if 'karakteristik' in data and data['karakteristik']:
            data['karakteristik'] = Karakteristik(data['karakteristik'])
        if 'bentuk_timbulan' in data and data['bentuk_timbulan']:
            data['bentuk_timbulan'] = BentukTimbulan(data['bentuk_timbulan'])

        for key, value in data.items():
            setattr(item, key, value)

        db.session.commit()
        return item

    @staticmethod
    def delete(item_id, user):
        item = db.session.get(LaporanSampahIlegal, item_id)
        if not item:
            raise NotFoundError("Laporan tidak ditemukan")

        if item.id_warga != user.id and not user.is_admin:
            raise ForbiddenError("Tidak memiliki akses untuk menghapus laporan ini")

        db.session.delete(item)
        db.session.commit()

    @staticmethod
    def get_my_laporan(user_id, page=1, per_page=20, search=None, status_laporan=None,
                jenis_sampah_id=None, sort_by='created_at', sort_order='desc'):
        query = LaporanSampahIlegal.query.filter_by(id_warga=user_id)

        if search:
            query = query.filter(
                LaporanSampahIlegal.alamat_lokasi.ilike(f'%{search}%')
            )

        if status_laporan:
            query = query.filter_by(status_laporan=StatusLaporan(status_laporan))

        if jenis_sampah_id:
            query = query.filter_by(jenis_sampah_id=jenis_sampah_id)

        sort_column = getattr(LaporanSampahIlegal, sort_by, LaporanSampahIlegal.created_at)
        if sort_order == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()
        return items, total


class TindakLanjutService:

    @staticmethod
    def get_by_laporan(laporan_id):
        laporan = db.session.get(LaporanSampahIlegal, laporan_id)
        if not laporan:
            raise NotFoundError("Laporan tidak ditemukan")
        return TindakLanjutLaporan.query.filter_by(id_laporan=laporan_id)\
            .order_by(TindakLanjutLaporan.created_at.desc()).all()

    @staticmethod
    def create(user, laporan_id, data):
        from app.lib.mailer import send_laporan_status_email
        
        laporan = db.session.get(LaporanSampahIlegal, laporan_id)
        if not laporan:
            raise NotFoundError("Laporan tidak ditemukan")

        if laporan.status_laporan not in [StatusLaporan.DITERIMA, StatusLaporan.DITINDAK]:
            raise ForbiddenError("Hanya laporan yang berstatus 'Diterima' atau sedang 'Ditindak' yang bisa diberi tindak lanjut")

        item = TindakLanjutLaporan(
            id_laporan=laporan_id,
            id_user_penindak=user.id,
            **data
        )
        db.session.add(item)
        
        # Automatically update status from DITERIMA to DITINDAK if first action
        if laporan.status_laporan == StatusLaporan.DITERIMA:
            laporan.status_laporan = StatusLaporan.DITINDAK
            if laporan.pelapor and laporan.pelapor.email:
                send_laporan_status_email(to=laporan.pelapor.email, laporan=laporan)

        db.session.commit()
        return item
