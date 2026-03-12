"""Artikel controller - Request handlers for artikel endpoints"""
from flask import request
from marshmallow import ValidationError

from app.api.services.artikel_service import ArtikelService
from app.schemas.artikel_schema import (
    ArtikelCreateSchema, ArtikelUpdateSchema, ArtikelQuerySchema, MyArtikelQuerySchema
)
from app.middlewares.auth_middleware import jwt_required_custom
from app.utils.response import success_response, error_response, paginated_response

def get_all():
    try:
        params = ArtikelQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    page = params.get('page', 1)
    per_page = params.get('per_page', 20)

    items, total = ArtikelService.get_all(
        page=page,
        per_page=per_page,
        search=params.get('search'),
        sort_by=params.get('sort_by', 'created_at'),
        sort_order=params.get('sort_order', 'desc'),
    )

    return paginated_response(
        data=[item.to_dict() for item in items],
        total=total,
        page=page,
        per_page=per_page,
        message="Daftar artikel berhasil diambil"
    )

def get_one(item_id):
    item = ArtikelService.get_by_id(item_id)
    return success_response(
        data=item.to_dict(include_content=True), 
        message="Detail artikel berhasil diambil"
    )

@jwt_required_custom
def my_artikel():
    try:
        # Menggunakan MyArtikelQuerySchema untuk validasi params pagination
        params = MyArtikelQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    page = params.get('page', 1)
    per_page = params.get('per_page', 20)

    # Memanggil service khusus artikel milik user sendiri
    items, total = ArtikelService.get_my_artikel(
        user_id=request.current_user.id,
        page=page,
        per_page=per_page,
        search=params.get('search'),
        sort_by=params.get('sort_by', 'created_at'),
        sort_order=params.get('sort_order', 'desc'),
    )

    return paginated_response(
        data=[item.to_dict() for item in items],
        total=total,
        page=page,
        per_page=per_page,
        message="Daftar artikel saya berhasil diambil"
    )

@jwt_required_custom
def create():
    # Proteksi: Hanya Admin atau Kolaborator Terverifikasi
    if not getattr(request.current_user, 'is_admin', False):
        kolaborator = getattr(request.current_user, 'kolaborator', None)
        if hasattr(kolaborator, 'first'):
            kolaborator = kolaborator.first()
        
        if not kolaborator or not getattr(kolaborator, 'status_verifikasi', False):
            from app.utils.exceptions import ForbiddenError
            raise ForbiddenError("Hanya Admin dan Kolaborator Terverifikasi yang dapat membuat artikel")

    try:
        data = ArtikelCreateSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    item = ArtikelService.create(request.current_user, data)
    return success_response(
        data=item.to_dict(include_content=True), 
        message="Artikel berhasil dibuat", 
        status_code=201
    )

@jwt_required_custom
def update(item_id):
    try:
        data = ArtikelUpdateSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    update_data = {k: v for k, v in data.items() if v is not None}
    item = ArtikelService.update(item_id, request.current_user, update_data)
    return success_response(
        data=item.to_dict(include_content=True), 
        message="Artikel berhasil diperbarui"
    )

@jwt_required_custom
def delete(item_id):
    ArtikelService.delete(item_id, request.current_user)
    return success_response(message="Artikel berhasil dihapus")