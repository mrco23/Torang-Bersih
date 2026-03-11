"""Laporan controller - Request handlers for laporan & tindak lanjut endpoints"""
from flask import request
from marshmallow import ValidationError

from app.api.services.laporan_service import LaporanService, TindakLanjutService
from app.schemas.laporan_schema import (
    LaporanCreateSchema, LaporanUpdateStatusSchema,
    LaporanQuerySchema, TindakLanjutCreateSchema, MyLaporanQuerySchema
)
from app.middlewares.auth_middleware import jwt_required_custom, admin_required
from app.utils.response import success_response, error_response, paginated_response


def get_all():
    try:
        params = LaporanQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    items, total = LaporanService.get_all(**params)

    return paginated_response(
        data=[item.to_dict() for item in items],
        total=total,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        message="Daftar laporan berhasil diambil"
    )


def get_one(item_id):
    item = LaporanService.get_by_id(item_id)
    data = item.to_dict()
    # Include tindak lanjut
    tindak_lanjut = TindakLanjutService.get_by_laporan(item_id)
    data['tindak_lanjut'] = [tl.to_dict() for tl in tindak_lanjut]
    return success_response(data=data, message="Detail laporan berhasil diambil")


@jwt_required_custom
def create():
    try:
        data = LaporanCreateSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    item = LaporanService.create(request.current_user, data)
    return success_response(data=item.to_dict(), message="Laporan berhasil dibuat", status_code=201)


@jwt_required_custom
def update_status(item_id):
    try:
        data = LaporanUpdateStatusSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    item = LaporanService.update_status(
        item_id, 
        data['status_laporan'], 
        request.current_user,
        data.get('catatan_verifikasi')
    )
    return success_response(data=item.to_dict(), message="Status laporan berhasil diperbarui")


@jwt_required_custom
def delete(item_id):
    LaporanService.delete(item_id, request.current_user)
    return success_response(message="Laporan berhasil dihapus")


# Tindak Lanjut
def get_tindak_lanjut(laporan_id):
    items = TindakLanjutService.get_by_laporan(laporan_id)
    return success_response(
        data=[item.to_dict() for item in items],
        message="Daftar tindak lanjut berhasil diambil"
    )


@jwt_required_custom
def create_tindak_lanjut(laporan_id):
    try:
        data = TindakLanjutCreateSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    item = TindakLanjutService.create(request.current_user, laporan_id, data)
    return success_response(data=item.to_dict(), message="Tindak lanjut berhasil ditambahkan", status_code=201)


@jwt_required_custom
def my_laporan():
    try:
        params = MyLaporanQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    items, total = LaporanService.get_my_laporan(request.current_user.id, **params)

    return paginated_response(
        data=[item.to_dict() for item in items],
        total=total,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        message="Daftar laporan saya berhasil diambil"
    )