"""Aset database model"""
import uuid
from datetime import datetime, timezone

from app.config.extensions import db


class Aset(db.Model):
    __tablename__ = 'aset'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_user = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)

    nama_aset = db.Column(db.String(200), nullable=False)
    kategori_aset_id = db.Column(db.String(36), db.ForeignKey('ref_kategori_aset.id'), nullable=False, index=True)
    status_aktif = db.Column(db.Boolean, default=True, nullable=False)

    # Lokasi
    kabupaten_kota = db.Column(db.String(100))
    alamat_lengkap = db.Column(db.Text)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    # Kontak
    penanggung_jawab = db.Column(db.String(100))
    kontak = db.Column(db.String(20))

    pictures_urls = db.Column(db.JSON)

    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f'<Aset {self.nama_aset}>'

    def to_dict(self):
        return {
            'id': self.id,
            'id_user': self.id_user,
            'nama_aset': self.nama_aset,
            'kategori_aset': self.kategori_ref.to_dict() if self.kategori_ref else None,
            'status_aktif': self.status_aktif,
            'kabupaten_kota': self.kabupaten_kota,
            'alamat_lengkap': self.alamat_lengkap,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'penanggung_jawab': self.penanggung_jawab,
            'kontak': self.kontak,
            'pictures_urls': self.pictures_urls,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
