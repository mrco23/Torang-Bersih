"""Dashboard service - Statistics for admin and user dashboards"""
from sqlalchemy import func

from app.config.extensions import db
from app.database.models import (
    Kolaborator, StatusVerifikasiKolaborator,
    Aset, StatusVerifikasiAset,
    LaporanSampahIlegal, StatusLaporan,
    TindakLanjutLaporan,
    MarketplaceDaurUlang, StatusKetersediaan,
    Artikel, StatusPublikasi,
    ArtikelLike, ArtikelKomentar,
)
from app.database.models.user import User


class DashboardService:

    @staticmethod
    def get_admin_stats():
        # ── Totals ──
        total_users = db.session.query(func.count(User.id)).scalar()
        total_kolaborator = db.session.query(func.count(Kolaborator.id)).scalar()
        total_aset = db.session.query(func.count(Aset.id)).scalar()
        total_laporan = db.session.query(func.count(LaporanSampahIlegal.id)).scalar()
        total_tindak_lanjut = db.session.query(func.count(TindakLanjutLaporan.id)).scalar()
        total_marketplace = db.session.query(func.count(MarketplaceDaurUlang.id)).scalar()
        total_artikel = db.session.query(func.count(Artikel.id)).scalar()
        total_artikel_likes = db.session.query(func.count(ArtikelLike.id)).scalar()
        total_artikel_komentar = db.session.query(func.count(ArtikelKomentar.id)).scalar()

        # ── Laporan per status ──
        laporan_per_status = {}
        for status in StatusLaporan:
            count = db.session.query(func.count(LaporanSampahIlegal.id)).filter(
                LaporanSampahIlegal.status_laporan == status
            ).scalar()
            laporan_per_status[status.value] = count

        # ── Kolaborator per status verifikasi ──
        kolaborator_per_status = {}
        for status in StatusVerifikasiKolaborator:
            count = db.session.query(func.count(Kolaborator.id)).filter(
                Kolaborator.status_verifikasi == status
            ).scalar()
            kolaborator_per_status[status.value] = count

        # ── Aset per status verifikasi ──
        aset_per_status = {}
        for status in StatusVerifikasiAset:
            count = db.session.query(func.count(Aset.id)).filter(
                Aset.status_verifikasi == status
            ).scalar()
            aset_per_status[status.value] = count

        # ── Marketplace per status ketersediaan ──
        marketplace_per_status = {}
        for status in StatusKetersediaan:
            count = db.session.query(func.count(MarketplaceDaurUlang.id)).filter(
                MarketplaceDaurUlang.status_ketersediaan == status
            ).scalar()
            marketplace_per_status[status.value] = count

        # ── Artikel per status publikasi ──
        artikel_per_status = {}
        for status in StatusPublikasi:
            count = db.session.query(func.count(Artikel.id)).filter(
                Artikel.status_publikasi == status
            ).scalar()
            artikel_per_status[status.value] = count

        # ── Recent items ──
        recent_laporan = LaporanSampahIlegal.query.order_by(
            LaporanSampahIlegal.created_at.desc()
        ).limit(5).all()

        recent_kolaborator = Kolaborator.query.order_by(
            Kolaborator.created_at.desc()
        ).limit(5).all()

        recent_artikel = Artikel.query.order_by(
            Artikel.created_at.desc()
        ).limit(5).all()

        return {
            'total_users': total_users,
            'total_kolaborator': total_kolaborator,
            'total_aset': total_aset,
            'total_laporan': total_laporan,
            'total_tindak_lanjut': total_tindak_lanjut,
            'total_marketplace': total_marketplace,
            'total_artikel': total_artikel,
            'total_artikel_likes': total_artikel_likes,
            'total_artikel_komentar': total_artikel_komentar,
            'laporan_per_status': laporan_per_status,
            'kolaborator_per_status': kolaborator_per_status,
            'aset_per_status': aset_per_status,
            'marketplace_per_status': marketplace_per_status,
            'artikel_per_status': artikel_per_status,
            'recent_laporan': [item.to_dict() for item in recent_laporan],
            'recent_kolaborator': [item.to_dict() for item in recent_kolaborator],
            'recent_artikel': [item.to_dict() for item in recent_artikel],
        }

    @staticmethod
    def get_user_stats(user_id):
        # ── My counts ──
        my_kolaborator = db.session.query(func.count(Kolaborator.id)).filter(
            Kolaborator.id_user == user_id
        ).scalar()
        my_aset = db.session.query(func.count(Aset.id)).filter(
            Aset.id_user == user_id
        ).scalar()
        my_laporan = db.session.query(func.count(LaporanSampahIlegal.id)).filter(
            LaporanSampahIlegal.id_warga == user_id
        ).scalar()
        my_marketplace = db.session.query(func.count(MarketplaceDaurUlang.id)).filter(
            MarketplaceDaurUlang.id_penjual == user_id
        ).scalar()
        my_artikel = db.session.query(func.count(Artikel.id)).filter(
            Artikel.id_penulis == user_id
        ).scalar()
        my_tindak_lanjut = db.session.query(func.count(TindakLanjutLaporan.id)).filter(
            TindakLanjutLaporan.id_user_penindak == user_id
        ).scalar()
        my_likes_diberikan = db.session.query(func.count(ArtikelLike.id)).filter(
            ArtikelLike.id_user == user_id
        ).scalar()
        my_komentar = db.session.query(func.count(ArtikelKomentar.id)).filter(
            ArtikelKomentar.id_user == user_id
        ).scalar()

        # ── My laporan per status ──
        my_laporan_per_status = {}
        for status in StatusLaporan:
            count = db.session.query(func.count(LaporanSampahIlegal.id)).filter(
                LaporanSampahIlegal.id_warga == user_id,
                LaporanSampahIlegal.status_laporan == status
            ).scalar()
            my_laporan_per_status[status.value] = count

        # ── My artikel per status publikasi ──
        my_artikel_per_status = {}
        for status in StatusPublikasi:
            count = db.session.query(func.count(Artikel.id)).filter(
                Artikel.id_penulis == user_id,
                Artikel.status_publikasi == status
            ).scalar()
            my_artikel_per_status[status.value] = count

        # ── Recent activity ──
        recent_laporan = LaporanSampahIlegal.query.filter_by(
            id_warga=user_id
        ).order_by(
            LaporanSampahIlegal.created_at.desc()
        ).limit(5).all()

        recent_artikel = Artikel.query.filter_by(
            id_penulis=user_id
        ).order_by(
            Artikel.created_at.desc()
        ).limit(5).all()

        return {
            'my_kolaborator': my_kolaborator,
            'my_aset': my_aset,
            'my_laporan': my_laporan,
            'my_marketplace': my_marketplace,
            'my_artikel': my_artikel,
            'my_tindak_lanjut': my_tindak_lanjut,
            'my_likes_diberikan': my_likes_diberikan,
            'my_komentar': my_komentar,
            'my_laporan_per_status': my_laporan_per_status,
            'my_artikel_per_status': my_artikel_per_status,
            'recent_laporan': [item.to_dict() for item in recent_laporan],
            'recent_artikel': [item.to_dict() for item in recent_artikel],
        }
