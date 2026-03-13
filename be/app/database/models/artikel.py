"""Artikel, ArtikelLike, ArtikelKomentar database models"""
import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum
from sqlalchemy import Enum, UniqueConstraint

from app.config.extensions import db


class StatusPublikasi(PyEnum):
    DRAFT = 'draft'
    PUBLISHED = 'published'
    ARCHIVED = 'archived'


class StatusKomentar(PyEnum):
    AKTIF = 'aktif'
    DISEMBUNYIKAN = 'disembunyikan'


class Artikel(db.Model):
    __tablename__ = 'artikel'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_penulis = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)

    judul_artikel = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    kategori_id = db.Column(db.String(36), db.ForeignKey('ref_kategori_artikel.id'), nullable=False, index=True)
    konten_teks = db.Column(db.Text)
    foto_cover_url = db.Column(db.String(500))
    status_publikasi = db.Column(Enum(StatusPublikasi), default=StatusPublikasi.DRAFT, nullable=False)
    jumlah_views = db.Column(db.Integer, default=0, nullable=False)

    waktu_publish = db.Column(db.DateTime(timezone=True))
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    likes = db.relationship('ArtikelLike', backref='artikel', lazy='dynamic', cascade='all, delete-orphan')
    komentar = db.relationship('ArtikelKomentar', backref='artikel', lazy='dynamic', cascade='all, delete-orphan')
    penulis = db.relationship('User', foreign_keys=[id_penulis], backref='artikel', lazy='select')

    def __repr__(self):
        return f'<Artikel {self.judul_artikel}>'

    def to_dict(self, include_content=False):
        data = {
            'id': self.id,
            'id_penulis': self.id_penulis,
            'penulis': self.penulis.to_dict() if self.penulis else None,
            'judul_artikel': self.judul_artikel,
            'slug': self.slug,
            'kategori': self.kategori_ref.to_dict() if self.kategori_ref else None,
            'foto_cover_url': self.foto_cover_url,
            'status_publikasi': self.status_publikasi.value if self.status_publikasi else None,
            'jumlah_views': self.jumlah_views,
            'jumlah_likes': self.likes.count(),
            'jumlah_komentar': self.komentar.count(),
            'waktu_publish': self.waktu_publish.isoformat() if self.waktu_publish else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_content:
            data['konten_teks'] = self.konten_teks
        return data


class ArtikelLike(db.Model):
    __tablename__ = 'artikel_likes'
    __table_args__ = (
        UniqueConstraint('id_artikel', 'id_user', name='uq_artikel_user_like'),
    )

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_artikel = db.Column(db.String(36), db.ForeignKey('artikel.id'), nullable=False, index=True)
    id_user = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)

    waktu_like = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    user = db.relationship('User', foreign_keys=[id_user], backref='artikel_likes', lazy='select')

    def __repr__(self):
        return f'<ArtikelLike artikel={self.id_artikel} user={self.id_user}>'

    def to_dict(self):
        return {
            'id': self.id,
            'id_artikel': self.id_artikel,
            'id_user': self.id_user,
            'user': self.user.to_dict() if self.user else None,
            'waktu_like': self.waktu_like.isoformat() if self.waktu_like else None,
        }


class ArtikelKomentar(db.Model):
    __tablename__ = 'artikel_komentar'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_artikel = db.Column(db.String(36), db.ForeignKey('artikel.id'), nullable=False, index=True)
    id_user = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)
    parent_id = db.Column(db.String(36), db.ForeignKey('artikel_komentar.id'), nullable=True)

    isi_komentar = db.Column(db.Text, nullable=False)
    status_komentar = db.Column(Enum(StatusKomentar), default=StatusKomentar.AKTIF, nullable=False)

    waktu_komentar = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Self-referential relationship for threaded comments
    replies = db.relationship('ArtikelKomentar', backref=db.backref('parent', remote_side='ArtikelKomentar.id'), lazy='dynamic')
    user = db.relationship('User', foreign_keys=[id_user], backref='artikel_komentar', lazy='select')

    def __repr__(self):
        return f'<ArtikelKomentar {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'id_artikel': self.id_artikel,
            'id_user': self.id_user,
            'user': self.user.to_dict() if self.user else None,
            'parent_id': self.parent_id,
            'isi_komentar': self.isi_komentar,
            'status_komentar': self.status_komentar.value if self.status_komentar else None,
            'waktu_komentar': self.waktu_komentar.isoformat() if self.waktu_komentar else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
