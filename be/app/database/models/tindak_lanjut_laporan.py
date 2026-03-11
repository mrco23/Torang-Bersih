"""Tindak Lanjut Laporan database model"""
import uuid
from datetime import datetime, timezone

from app.config.extensions import db


class TindakLanjutLaporan(db.Model):
    __tablename__ = 'tindak_lanjut_laporan'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    id_laporan = db.Column(db.String(36), db.ForeignKey('laporan_sampah_ilegal.id'), nullable=False, index=True)

    tindak_lanjut_penanganan = db.Column(db.String(200), nullable=False)
    tim_penindak = db.Column(db.String(200))
    foto_sebelum_tindakan_urls = db.Column(db.JSON)
    foto_setelah_tindakan_urls = db.Column(db.JSON)

    id_user_penindak = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False, index=True)

    catatan = db.Column(db.Text)

    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    penindak = db.relationship('User', foreign_keys=[id_user_penindak], backref='tindak_lanjut', lazy='select')

    def __repr__(self):
        return f'<TindakLanjutLaporan {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'id_laporan': self.id_laporan,
            'tindak_lanjut_penanganan': self.tindak_lanjut_penanganan,
            'tim_penindak': self.tim_penindak,
            'foto_sebelum_tindakan_urls': self.foto_sebelum_tindakan_urls,
            'foto_setelah_tindakan_urls': self.foto_setelah_tindakan_urls,
            'id_user_penindak': self.id_user_penindak,
            'penindak': {
                'id': self.penindak.id,
                'username': self.penindak.username,
                'full_name': self.penindak.full_name,
                'avatar_url': self.penindak.avatar_url,
            } if self.penindak else None,
            'catatan': self.catatan,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
