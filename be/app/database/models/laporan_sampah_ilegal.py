"""Laporan Sampah Ilegal database model"""
import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Enum

from app.config.extensions import db


class Karakteristik(PyEnum):
    BISA_DIDAUR_ULANG = 'bisa_didaur_ulang'
    RESIDU = 'residu'


class BentukTimbulan(PyEnum):
    TERCECER = 'tercecer'
    MENUMPUK = 'menumpuk'


class StatusLaporan(PyEnum):
    MENUNGGU = 'menunggu'
    DITERIMA = 'diterima'
    DITINDAK = 'ditindak'
    SELESAI = 'selesai'


class LaporanSampahIlegal(db.Model):
    __tablename__ = 'laporan_sampah_ilegal'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_warga = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)

    foto_bukti_urls = db.Column(db.JSON)

    # Lokasi
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    alamat_lokasi = db.Column(db.Text)

    # Detail sampah
    jenis_sampah_id = db.Column(db.String(36), db.ForeignKey('ref_jenis_sampah.id'), nullable=False, index=True)
    estimasi_berat_kg = db.Column(db.Float)
    karakteristik = db.Column(Enum(Karakteristik))
    bentuk_timbulan = db.Column(Enum(BentukTimbulan))

    status_laporan = db.Column(Enum(StatusLaporan), default=StatusLaporan.MENUNGGU, nullable=False)

    tanggal_lapor = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    tindak_lanjut = db.relationship('TindakLanjutLaporan', backref='laporan', lazy='dynamic', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<LaporanSampahIlegal {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'id_warga': self.id_warga,
            'foto_bukti_urls': self.foto_bukti_urls,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'alamat_lokasi': self.alamat_lokasi,
            'jenis_sampah': self.jenis_sampah_ref.to_dict() if self.jenis_sampah_ref else None,
            'estimasi_berat_kg': self.estimasi_berat_kg,
            'karakteristik': self.karakteristik.value if self.karakteristik else None,
            'bentuk_timbulan': self.bentuk_timbulan.value if self.bentuk_timbulan else None,
            'status_laporan': self.status_laporan.value if self.status_laporan else None,
            'tanggal_lapor': self.tanggal_lapor.isoformat() if self.tanggal_lapor else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
