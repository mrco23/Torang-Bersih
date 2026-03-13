"""Marketplace controller - Request handlers for marketplace endpoints"""
from flask import request
from marshmallow import ValidationError

from app.api.services.marketplace_service import MarketplaceService
from app.schemas.marketplace_schema import (
    MarketplaceCreateSchema, MarketplaceUpdateSchema, MarketplaceQuerySchema, MarketplaceUpdateKetersediaanSchema
)
from app.middlewares.auth_middleware import jwt_required_custom
from app.utils.response import success_response, error_response, paginated_response


def get_all():
    try:
        params = MarketplaceQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    items, total = MarketplaceService.get_all(
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        search=params.get('search'),
        kategori_barang_id=params.get('kategori_barang_id'),
        kondisi=params.get('kondisi'),
        status_ketersediaan=params.get('status_ketersediaan'),
        kabupaten_kota=params.get('kabupaten_kota'),
        sort_by=params.get('sort_by', 'created_at'),
        sort_order=params.get('sort_order', 'desc')
    )

    return paginated_response(
        data=[item.to_dict() for item in items],
        total=total,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        message="Daftar barang berhasil diambil"
    )


def get_one(item_id):
    item = MarketplaceService.get_by_id(item_id)
    return success_response(data=item.to_dict(), message="Detail barang berhasil diambil")


@jwt_required_custom
def create():
    if request.content_type and 'multipart/form-data' in request.content_type:
        raw_data = request.form.to_dict()
        if 'latitude' in raw_data and raw_data['latitude']:
            raw_data['latitude'] = float(raw_data['latitude'])
        if 'longitude' in raw_data and raw_data['longitude']:
            raw_data['longitude'] = float(raw_data['longitude'])
    else:
        raw_data = request.get_json() or {}

    try:
        data = MarketplaceCreateSchema().load(raw_data)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    # Precheck (ref + duplikasi) sebelum upload foto
    MarketplaceService.precheck_create(request.current_user, data)

    # Handle multiple foto uploads
    if 'foto_barang_urls' in request.files:
        from app.lib.cloudinary import upload_images_concurrently
        files = request.files.getlist('foto_barang_urls')
        uploaded_urls = upload_images_concurrently(files, folder="marketplace_pictures")
        
        if uploaded_urls:
            data['foto_barang_urls'] = uploaded_urls

    item = MarketplaceService.create(request.current_user, data)
    return success_response(data=item.to_dict(), message="Barang berhasil ditambahkan", status_code=201)


@jwt_required_custom
def update(item_id):
    if request.content_type and 'multipart/form-data' in request.content_type:
        raw_data = request.form.to_dict()
        if 'latitude' in raw_data and raw_data['latitude']:
            raw_data['latitude'] = float(raw_data['latitude'])
        if 'longitude' in raw_data and raw_data['longitude']:
            raw_data['longitude'] = float(raw_data['longitude'])
        if 'existing_pictures' in request.form:
            raw_data['existing_pictures'] = request.form.getlist('existing_pictures')
    else:
        raw_data = request.get_json() or {}

    try:
        data = MarketplaceUpdateSchema().load(raw_data)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    # Precheck sebelum upload foto (akses + ref + duplikasi nama)
    MarketplaceService.precheck_update(item_id, request.current_user, data)

    # Check for existing pictures kept by user
    existing_pictures = request.form.getlist('existing_pictures') if request.form else []
    if not request.form and 'existing_pictures' in raw_data:
        existing_pictures = raw_data.get('existing_pictures', [])

    uploaded_urls = list(existing_pictures)

    # Handle multiple new foto uploads
    if 'foto_barang_urls' in request.files:
        from app.lib.cloudinary import upload_images_concurrently
        files = request.files.getlist('foto_barang_urls')
        new_urls = upload_images_concurrently(files, folder="marketplace_pictures")
        uploaded_urls.extend(new_urls)
        
    if request.form and 'existing_pictures' in request.form:
        data['foto_barang_urls'] = uploaded_urls
    elif 'foto_barang_urls' in request.files:
        data['foto_barang_urls'] = uploaded_urls

    update_data = {k: v for k, v in data.items() if v is not None}
    if not update_data:
        return error_response(message="Tidak ada data yang diubah", status_code=400)

    item = MarketplaceService.update(item_id, request.current_user, update_data)
    return success_response(data=item.to_dict(), message="Barang berhasil diperbarui")


@jwt_required_custom
def delete(item_id):
    MarketplaceService.delete(item_id, request.current_user)
    return success_response(message="Barang berhasil dihapus")


@jwt_required_custom
def update_ketersediaan(item_id):
    try:
        data = MarketplaceUpdateKetersediaanSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    item = MarketplaceService.update_ketersediaan(
        item_id,
        user=request.current_user,
        status_str=data['status_ketersediaan'],
    )
    return success_response(data=item.to_dict(), message="Status verifikasi aset berhasil diperbarui")


@jwt_required_custom
def my_marketplace():
    try:
        params = MarketplaceQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    items, total = MarketplaceService.get_my_marketplace(
        request.current_user.id,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        search=params.get('search'),
        kategori_barang_id=params.get('kategori_barang_id'),
        kondisi=params.get('kondisi'),
        status_ketersediaan=params.get('status_ketersediaan'),
        kabupaten_kota=params.get('kabupaten_kota'),
        sort_by=params.get('sort_by', 'created_at'),
        sort_order=params.get('sort_order', 'desc')
    )

    return paginated_response(
        data=[item.to_dict() for item in items],
        total=total,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        message="Daftar barang saya berhasil diambil"
    )