"""Artikel controller - Request handlers for artikel endpoints"""
from flask import request
from marshmallow import ValidationError

from app.api.services.artikel_service import ArtikelService
from app.schemas.artikel_schema import (
    ArtikelCreateSchema, ArtikelUpdateSchema, ArtikelQuerySchema, MyArtikelQuerySchema
)
from app.middlewares.auth_middleware import jwt_required_custom, optional_jwt
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

    # Note: get_all in artikel_service doesn't use pagination anymore
    items, total = ArtikelService.get_all(
        search=params.get('search'),
        sort_by=params.get('sort_by', 'created_at'),
        sort_order=params.get('sort_order', 'desc'),
    )

    return success_response(
        data=[item.to_dict() for item in items],
        message="Daftar artikel berhasil diambil"
    )


def get_one(item_id):
    item = ArtikelService.get_by_id(item_id)
    return success_response(data=item.to_dict(include_content=True), message="Detail artikel berhasil diambil")


@jwt_required_custom
def create():
    try:
        data = ArtikelCreateSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    item = ArtikelService.create(request.current_user, data)
    return success_response(data=item.to_dict(include_content=True), message="Artikel berhasil dibuat", status_code=201)


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
    if not update_data:
        return error_response(message="Tidak ada data yang diubah", status_code=400)

    item = ArtikelService.update(item_id, request.current_user, update_data)
    return success_response(data=item.to_dict(include_content=True), message="Artikel berhasil diperbarui")


@jwt_required_custom
def delete(item_id):
    ArtikelService.delete(item_id, request.current_user)
    return success_response(message="Artikel berhasil dihapus")


@jwt_required_custom
def my_artikel():
    try:
        params = MyArtikelQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    items, total = ArtikelService.get_my_artikel(
        request.current_user.id,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        search=params.get('search'),
        sort_by=params.get('sort_by', 'created_at'),
        sort_order=params.get('sort_order', 'desc'),
    )

    return paginated_response(
        data=[item.to_dict() for item in items],
        total=total,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        message="Daftar artikel saya berhasil diambil"
    )
