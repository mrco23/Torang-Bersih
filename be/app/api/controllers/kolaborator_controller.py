"""Kolaborator controller - Request handlers for kolaborator endpoints"""
from flask import request
from marshmallow import ValidationError

from app.api.services.kolaborator_service import KolaboratorService
from app.schemas.kolaborator_schema import (
    KolaboratorCreateSchema, KolaboratorUpdateSchema, KolaboratorQuerySchema
)
from app.middlewares.auth_middleware import jwt_required_custom, optional_jwt, admin_required
from app.utils.response import success_response, error_response, paginated_response


def get_all():
    try:
        params = KolaboratorQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    items, total = KolaboratorService.get_all(
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        search=params.get('search'),
        jenis_kolaborator_id=params.get('jenis_kolaborator_id'),
        kabupaten_kota=params.get('kabupaten_kota'),
        sort_by=params.get('sort_by', 'created_at'),
        sort_order=params.get('sort_order', 'desc'),
    )

    return paginated_response(
        data=[item.to_dict() for item in items],
        total=total,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        message="Daftar kolaborator berhasil diambil"
    )


def get_one(item_id):
    item = KolaboratorService.get_by_id(item_id)
    return success_response(data=item.to_dict(), message="Detail kolaborator berhasil diambil")


@jwt_required_custom
def create():
    try:
        data = KolaboratorCreateSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    item = KolaboratorService.create(request.current_user, data)
    return success_response(data=item.to_dict(), message="Kolaborator berhasil didaftarkan", status_code=201)


@jwt_required_custom
def update(item_id):
    try:
        data = KolaboratorUpdateSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    update_data = {k: v for k, v in data.items() if v is not None}
    if not update_data:
        return error_response(message="Tidak ada data yang diubah", status_code=400)

    item = KolaboratorService.update(item_id, request.current_user, update_data)
    return success_response(data=item.to_dict(), message="Kolaborator berhasil diperbarui")


@jwt_required_custom
def delete(item_id):
    KolaboratorService.delete(item_id, request.current_user)
    return success_response(message="Kolaborator berhasil dihapus")


@admin_required
def verify(item_id):
    item = KolaboratorService.verify(item_id)
    return success_response(data=item.to_dict(), message="Kolaborator berhasil diverifikasi")


@jwt_required_custom
def my_kolaborator():
    try:
        params = KolaboratorQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    items, total = KolaboratorService.get_my_kolaborator(
        request.current_user.id,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        search=params.get('search'),
        jenis_kolaborator_id=params.get('jenis_kolaborator_id'),
        kabupaten_kota=params.get('kabupaten_kota'),
        sort_by=params.get('sort_by', 'created_at'),
        sort_order=params.get('sort_order', 'desc'),
    )

    return paginated_response(
        data=[item.to_dict() for item in items],
        total=total,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        message="Daftar kolaborator saya berhasil diambil"
    )