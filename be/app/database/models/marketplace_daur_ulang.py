"""Marketplace Daur Ulang database model"""
import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Enum

from app.config.extensions import db


class KondisiBarang(PyEnum):
    LAYAK_PAKAI = 'layak_pakai'
    BUTUH_PERBAIKAN = 'butuh_perbaikan'
    RONGSOKAN = 'rongsokan'


class StatusKetersediaan(PyEnum):
    TERSEDIA = 'tersedia'
    DIPESAN = 'dipesan'
    TERJUAL = 'terjual'


class MarketplaceDaurUlang(db.Model):
    __tablename__ = 'marketplace_daur_ulang'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_penjual = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)

    nama_barang = db.Column(db.String(150), nullable=False)
    kategori_barang_id = db.Column(db.String(36), db.ForeignKey('ref_kategori_barang.id'), nullable=False, index=True)
    deskripsi_barang = db.Column(db.Text)
    harga = db.Column(db.Integer, default=0)
    berat_estimasi_kg = db.Column(db.Float)
    kondisi = db.Column(Enum(KondisiBarang), nullable=False)
    foto_barang_urls = db.Column(db.JSON)

    # Lokasi COD
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    status_ketersediaan = db.Column(Enum(StatusKetersediaan), default=StatusKetersediaan.TERSEDIA, nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    def __repr__(self):
        return f'<MarketplaceDaurUlang {self.nama_barang}>'

    def to_dict(self):
        return {
            'id': self.id,
            'id_penjual': self.id_penjual,
            'nama_barang': self.nama_barang,
            'kategori_barang': self.kategori_ref.to_dict() if self.kategori_ref else None,
            'deskripsi_barang': self.deskripsi_barang,
            'harga': self.harga,
            'berat_estimasi_kg': self.berat_estimasi_kg,
            'kondisi': self.kondisi.value if self.kondisi else None,
            'foto_barang_urls': self.foto_barang_urls,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'status_ketersediaan': self.status_ketersediaan.value if self.status_ketersediaan else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
