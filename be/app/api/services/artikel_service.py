"""Artikel service - Business logic for artikel"""

from sqlalchemy import or_

from app.config.extensions import db
from app.database.models import Artikel
from app.utils.exceptions import NotFoundError, ForbiddenError

class ArtikelService:
    @staticmethod
    def get_all(search=None, sort_by='created_at', sort_order='desc'):
        query = Artikel.query

        if search:
            query = query.filter(
                or_(
                    Artikel.judul_artikel.ilike(f'%{search}%'),
                    Artikel.konten_teks.ilike(f'%{search}%'),
                )
            )

        # Sorting
        sort_column = getattr(Artikel, sort_by, Artikel.created_at)
        if sort_order == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        items = query.all()
        total = len(items)

        return items, total


    @staticmethod
    def get_by_id(item_id):
        item = db.session.get(Artikel, item_id)
        if not item:
            raise NotFoundError("Artikel tidak ditemukan")
        return item

    @staticmethod
    def create(user, data):
        item = Artikel(id_penulis=user.id, **data)
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def update(item_id, user, data):
        item = db.session.get(Artikel, item_id)
        if not item:
            raise NotFoundError("Artikel tidak ditemukan")

        # Only owner or admin can update
        if item.id_penulis != user.id and not getattr(user, 'is_admin', False):
            raise ForbiddenError("Tidak memiliki akses untuk mengubah artikel ini")

        for key, value in data.items():
            setattr(item, key, value)

        db.session.commit()
        return item

    @staticmethod
    def delete(item_id, user):
        item = db.session.get(Artikel, item_id)
        if not item:
            raise NotFoundError("Artikel tidak ditemukan")

        if item.id_penulis != user.id and not getattr(user, 'is_admin', False):
            raise ForbiddenError("Tidak memiliki akses untuk menghapus artikel ini")

        db.session.delete(item)
        db.session.commit()

    @staticmethod
    def get_my_artikel(user_id, page=1, per_page=20, search=None, sort_by='created_at', sort_order='desc'):
        query = Artikel.query.filter_by(id_penulis=user_id)

        if search:
            query = query.filter(
                or_(
                    Artikel.judul_artikel.ilike(f'%{search}%'),
                    Artikel.konten_teks.ilike(f'%{search}%'),
                )
            )

        # Sorting
        sort_column = getattr(Artikel, sort_by, Artikel.created_at)
        if sort_order == 'asc':
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()

        return items, total 