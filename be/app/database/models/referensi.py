"""Reference/Lookup tables for CRUD-able categories"""
import uuid
from datetime import datetime, timezone

from app.config.extensions import db


class RefJenisKolaborator(db.Model):
    __tablename__ = 'ref_jenis_kolaborator'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nama = db.Column(db.String(100), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationship
    kolaborator = db.relationship('Kolaborator', backref='jenis_ref', lazy='dynamic')

    def __repr__(self):
        return f'<RefJenisKolaborator {self.nama}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nama': self.nama,
            'is_active': self.is_active,
        }


class RefKategoriAset(db.Model):
    __tablename__ = 'ref_kategori_aset'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nama = db.Column(db.String(100), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationship
    aset = db.relationship('Aset', backref='kategori_ref', lazy='dynamic')

    def __repr__(self):
        return f'<RefKategoriAset {self.nama}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nama': self.nama,
            'is_active': self.is_active,
        }


class RefJenisSampah(db.Model):
    __tablename__ = 'ref_jenis_sampah'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nama = db.Column(db.String(100), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationship
    laporan = db.relationship('LaporanSampahIlegal', backref='jenis_sampah_ref', lazy='dynamic')

    def __repr__(self):
        return f'<RefJenisSampah {self.nama}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nama': self.nama,
            'is_active': self.is_active,
        }


class RefKategoriBarang(db.Model):
    __tablename__ = 'ref_kategori_barang'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nama = db.Column(db.String(100), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationship
    marketplace_items = db.relationship('MarketplaceDaurUlang', backref='kategori_ref', lazy='dynamic')

    def __repr__(self):
        return f'<RefKategoriBarang {self.nama}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nama': self.nama,
            'is_active': self.is_active,
        }


class RefKategoriArtikel(db.Model):
    __tablename__ = 'ref_kategori_artikel'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nama = db.Column(db.String(100), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationship
    artikel = db.relationship('Artikel', backref='kategori_ref', lazy='dynamic')

    def __repr__(self):
        return f'<RefKategoriArtikel {self.nama}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nama': self.nama,
            'is_active': self.is_active,
        }
