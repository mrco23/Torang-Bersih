"""Kolaborator database model"""
import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Enum

from app.config.extensions import db


class StatusVerifikasiKolaborator(PyEnum):
    MENUNGGU = 'menunggu'
    TERVERIFIKASI = 'terverifikasi'
    DITOLAK = 'ditolak'


class Kolaborator(db.Model):
    __tablename__ = 'kolaborator'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_user = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    
    nama_organisasi = db.Column(db.String(100), nullable=False)
    jenis_kolaborator_id = db.Column(db.String(36), db.ForeignKey('ref_jenis_kolaborator.id'), nullable=False, index=True)
    deskripsi = db.Column(db.Text)
    logo_url = db.Column(db.String(500), nullable=True)
    email = db.Column(db.String(100), nullable=True)

    # Lokasi
    kabupaten_kota = db.Column(db.String(100))
    alamat_lengkap = db.Column(db.Text)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    # Kontak
    penanggung_jawab = db.Column(db.String(100))
    kontak = db.Column(db.String(20), nullable=True)
    sosmed = db.Column(db.String(500), nullable=True)

    status_aktif = db.Column(db.Boolean, default=True, nullable=False)

    # Verifikasi
    status_verifikasi = db.Column(Enum(StatusVerifikasiKolaborator), default=StatusVerifikasiKolaborator.MENUNGGU, nullable=False)
    id_admin_verifikator = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    catatan_verifikasi = db.Column(db.Text, nullable=True)
    waktu_verifikasi = db.Column(db.DateTime(timezone=True), nullable=True)

    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationship
    admin_verifikator = db.relationship('User', foreign_keys=[id_admin_verifikator], backref='kolaborator_diverifikasi', lazy='select')
    user = db.relationship('User', foreign_keys=[id_user], backref='kolaborator', lazy='select')

    def __repr__(self):
        return f'<Kolaborator {self.nama_organisasi}>'

    def to_dict(self):
        return {
            'id': self.id,
            'id_user': self.id_user,
            'user': self.user.to_dict() if self.user else None,
            'nama_organisasi': self.nama_organisasi,
            'jenis_kolaborator': self.jenis_ref.to_dict() if self.jenis_ref else None,
            'deskripsi': self.deskripsi,
            'logo_url': self.logo_url,
            'email': self.email,
            'kabupaten_kota': self.kabupaten_kota,
            'alamat_lengkap': self.alamat_lengkap,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'penanggung_jawab': self.penanggung_jawab,
            'kontak': self.kontak,
            'sosmed': self.sosmed,
            'status_aktif': self.status_aktif,
            'status_verifikasi': self.status_verifikasi.value if self.status_verifikasi else None,
            'id_admin_verifikator': self.id_admin_verifikator,
            'admin_verifikator': {
                'id': self.admin_verifikator.id,
                'username': self.admin_verifikator.username,
                'full_name': self.admin_verifikator.full_name,
            } if self.admin_verifikator else None,
            'catatan_verifikasi': self.catatan_verifikasi,
            'waktu_verifikasi': self.waktu_verifikasi.isoformat() if self.waktu_verifikasi else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
