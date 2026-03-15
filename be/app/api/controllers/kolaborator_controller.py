"""Kolaborator controller - Request handlers for kolaborator endpoints"""
from flask import request
from marshmallow import ValidationError

from app.api.services.kolaborator_service import KolaboratorService
from app.schemas.kolaborator_schema import (
    KolaboratorCreateSchema, KolaboratorUpdateSchema, KolaboratorQuerySchema,
    KolaboratorVerifySchema
)
from app.middlewares.auth_middleware import jwt_required_custom, optional_jwt, admin_required
from app.utils.response import success_response, error_response, paginated_response


def get_all():
    try:
        params = KolaboratorQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    items, total = KolaboratorService.get_all(
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        search=params.get('search'),
        jenis_kolaborator_id=params.get('jenis_kolaborator_id'),
        kabupaten_kota=params.get('kabupaten_kota'),
        status_aktif=params.get('status_aktif'),
        status_verifikasi=params.get('status_verifikasi'),
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
    # Support both JSON and multipart/form-data (for logo upload)
    if request.content_type and 'multipart/form-data' in request.content_type:
        raw_data = request.form.to_dict()
        # Convert numeric strings to proper types
        if 'latitude' in raw_data and raw_data['latitude']:
            raw_data['latitude'] = float(raw_data['latitude'])
        if 'longitude' in raw_data and raw_data['longitude']:
            raw_data['longitude'] = float(raw_data['longitude'])
    else:
        raw_data = request.get_json() or {}

    try:
        data = KolaboratorCreateSchema().load(raw_data)
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    # Precheck (ref + duplikasi) sebelum upload logo
    KolaboratorService.precheck_create(request.current_user, data)

    # Handle logo file upload if present
    if 'logo' in request.files:
        logo_file = request.files['logo']
        if logo_file.filename:
            from app.lib.cloudinary import upload_image
            upload_result = upload_image(
                logo_file,
                folder="kolaborator_logos",
                transformation={"width": 400, "height": 400, "crop": "fill"}
            )
            if upload_result:
                data['logo_url'] = upload_result['url']
            else:
                return error_response(message="Gagal mengunggah logo", status_code=500)

    item = KolaboratorService.create(request.current_user, data)
    return success_response(data=item.to_dict(), message="Kolaborator berhasil didaftarkan", status_code=201)


@jwt_required_custom
def update(item_id):
    # Support both JSON and multipart/form-data (for logo re-upload)
    if request.content_type and 'multipart/form-data' in request.content_type:
        raw_data = request.form.to_dict()
        if 'latitude' in raw_data and raw_data['latitude']:
            raw_data['latitude'] = float(raw_data['latitude'])
        if 'longitude' in raw_data and raw_data['longitude']:
            raw_data['longitude'] = float(raw_data['longitude'])
    else:
        raw_data = request.get_json() or {}

    try:
        data = KolaboratorUpdateSchema().load(raw_data)
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    # Precheck sebelum upload logo (akses + ref + duplikasi nama)
    KolaboratorService.precheck_update(item_id, request.current_user, data)

    # Handle logo file upload if present
    if 'logo' in request.files:
        logo_file = request.files['logo']
        if logo_file.filename:
            from app.lib.cloudinary import upload_image
            upload_result = upload_image(
                logo_file,
                folder="kolaborator_logos",
                transformation={"width": 400, "height": 400, "crop": "fill"}
            )
            if upload_result:
                data['logo_url'] = upload_result['url']
            else:
                return error_response(message="Gagal mengunggah logo", status_code=500)

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
    try:
        data = KolaboratorVerifySchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    item = KolaboratorService.verify(
        item_id,
        admin_user=request.current_user,
        status_str=data['status_verifikasi'],
        catatan=data.get('catatan_verifikasi'),
    )
    return success_response(data=item.to_dict(), message="Status verifikasi kolaborator berhasil diperbarui")


@jwt_required_custom
def my_kolaborator():
    try:
        params = KolaboratorQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
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
        status_aktif=params.get('status_aktif'),
        status_verifikasi=params.get('status_verifikasi'),
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