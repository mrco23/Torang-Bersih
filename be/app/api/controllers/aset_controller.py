"""Aset controller - Request handlers for aset endpoints"""
from flask import request
from marshmallow import ValidationError

from app.api.services.aset_service import AsetService
from app.schemas.aset_schema import AsetCreateSchema, AsetUpdateSchema, AsetQuerySchema, AsetVerifySchema
from app.middlewares.auth_middleware import jwt_required_custom, admin_required
from app.utils.response import success_response, error_response, paginated_response


def get_all():
    try:
        params = AsetQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    items, total = AsetService.get_all(
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        search=params.get('search'),
        kategori_aset_id=params.get('kategori_aset_id'),
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
        message="Daftar aset berhasil diambil"
    )


def get_one(item_id):
    item = AsetService.get_by_id(item_id)
    return success_response(data=item.to_dict(), message="Detail aset berhasil diambil")


@jwt_required_custom
def create():
    if request.content_type and 'multipart/form-data' in request.content_type:
        raw_data = request.form.to_dict()
        if 'latitude' in raw_data and raw_data['latitude']:
            raw_data['latitude'] = float(raw_data['latitude'])
        if 'longitude' in raw_data and raw_data['longitude']:
            raw_data['longitude'] = float(raw_data['longitude'])
        # Handle status_aktif boolean conversion
        if 'status_aktif' in raw_data:
            raw_data['status_aktif'] = str(raw_data['status_aktif']).lower() in ['true', '1', 'yes']
    else:
        raw_data = request.get_json() or {}

    try:
        data = AsetCreateSchema().load(raw_data)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    # Precheck (ref + duplikasi) sebelum upload foto
    AsetService.precheck_create(request.current_user, data)

    # Handle multiple foto uploads
    if 'pictures_urls' in request.files:
        from app.lib.cloudinary import upload_images_concurrently
        files = request.files.getlist('pictures_urls')
        uploaded_urls = upload_images_concurrently(files, folder="aset_pictures")
        
        if uploaded_urls:
            data['pictures_urls'] = uploaded_urls

    item = AsetService.create(request.current_user, data)
    return success_response(data=item.to_dict(), message="Aset berhasil didaftarkan", status_code=201)


@jwt_required_custom
def update(item_id):
    if request.content_type and 'multipart/form-data' in request.content_type:
        raw_data = request.form.to_dict()
        if 'latitude' in raw_data and raw_data['latitude']:
            raw_data['latitude'] = float(raw_data['latitude'])
        if 'longitude' in raw_data and raw_data['longitude']:
            raw_data['longitude'] = float(raw_data['longitude'])
        if 'status_aktif' in raw_data:
            raw_data['status_aktif'] = str(raw_data['status_aktif']).lower() in ['true', '1', 'yes']
        if 'existing_pictures' in request.form:
            raw_data['existing_pictures'] = request.form.getlist('existing_pictures')
    else:
        raw_data = request.get_json() or {}

    try:
        data = AsetUpdateSchema().load(raw_data)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    # Precheck sebelum upload foto (akses + ref + duplikasi nama)
    AsetService.precheck_update(item_id, request.current_user, data)

    # Check for existing pictures kept by user
    existing_pictures = request.form.getlist('existing_pictures') if request.form else []
    if not request.form and 'existing_pictures' in raw_data:
        existing_pictures = raw_data.get('existing_pictures', [])

    uploaded_urls = list(existing_pictures)

    # Handle multiple new foto uploads
    if 'pictures_urls' in request.files:
        from app.lib.cloudinary import upload_images_concurrently
        files = request.files.getlist('pictures_urls')
        new_urls = upload_images_concurrently(files, folder="aset_pictures")
        uploaded_urls.extend(new_urls)
        
    if request.form and 'existing_pictures' in request.form:
        data['pictures_urls'] = uploaded_urls
    elif 'pictures_urls' in request.files:
        data['pictures_urls'] = uploaded_urls

    update_data = {k: v for k, v in data.items() if v is not None}
    if not update_data:
        return error_response(message="Tidak ada data yang diubah", status_code=400)

    item = AsetService.update(item_id, request.current_user, update_data)
    return success_response(data=item.to_dict(), message="Aset berhasil diperbarui")


@jwt_required_custom
def delete(item_id):
    AsetService.delete(item_id, request.current_user)
    return success_response(message="Aset berhasil dihapus")


@admin_required
def verify(item_id):
    try:
        data = AsetVerifySchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    item = AsetService.verify(
        item_id,
        admin_user=request.current_user,
        status_str=data['status_verifikasi'],
        catatan=data.get('catatan_verifikasi'),
    )
    return success_response(data=item.to_dict(), message="Status verifikasi aset berhasil diperbarui")


@jwt_required_custom
def my_aset():
    try:
        params = AsetQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    items, total = AsetService.get_my_aset(
        request.current_user.id,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        search=params.get('search'),
        kategori_aset_id=params.get('kategori_aset_id'),
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
        message="Daftar aset saya berhasil diambil"
    )