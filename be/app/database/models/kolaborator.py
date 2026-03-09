"""Kolaborator database model"""
import uuid
from datetime import datetime, timezone

from app.config.extensions import db


class Kolaborator(db.Model):
    __tablename__ = 'kolaborator'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_user = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    
    nama_organisasi = db.Column(db.String(100), nullable=False)
    jenis_kolaborator_id = db.Column(db.String(36), db.ForeignKey('ref_jenis_kolaborator.id'), nullable=False, index=True)
    deskripsi = db.Column(db.Text)
    logo_url = db.Column(db.String(500))
    email = db.Column(db.String(100))

    # Lokasi
    kabupaten_kota = db.Column(db.String(100))
    alamat_lengkap = db.Column(db.Text)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    # Kontak
    penanggung_jawab = db.Column(db.String(100))
    kontak = db.Column(db.String(20))
    sosmed = db.Column(db.String(500))

    status_verifikasi = db.Column(db.Boolean, default=False, nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f'<Kolaborator {self.nama_organisasi}>'

    def to_dict(self):
        return {
            'id': self.id,
            'id_user': self.id_user,
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
            'status_verifikasi': self.status_verifikasi,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
