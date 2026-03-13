"""Laporan controller - Request handlers for laporan & tindak lanjut endpoints"""
from flask import request
from marshmallow import ValidationError

from app.api.services.laporan_service import LaporanService, TindakLanjutService
from app.schemas.laporan_schema import (
    LaporanCreateSchema, LaporanUpdateSchema, LaporanUpdateStatusSchema,
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

    items, total = LaporanService.get_all(
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        search=params.get('search'),
        status_laporan=params.get('status_laporan'),
        jenis_sampah_id=params.get('jenis_sampah_id'),
        id_warga=params.get('id_warga'),
        sort_by=params.get('sort_by', 'created_at'),
        sort_order=params.get('sort_order', 'desc'),
    )

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
    # Support both JSON and multipart/form-data (for foto upload)
    if request.content_type and 'multipart/form-data' in request.content_type:
        raw_data = request.form.to_dict()
        # Convert numeric strings to proper types
        if 'latitude' in raw_data and raw_data['latitude']:
            raw_data['latitude'] = float(raw_data['latitude'])
        if 'longitude' in raw_data and raw_data['longitude']:
            raw_data['longitude'] = float(raw_data['longitude'])
        if 'estimasi_berat_kg' in raw_data and raw_data['estimasi_berat_kg']:
            raw_data['estimasi_berat_kg'] = float(raw_data['estimasi_berat_kg'])
    else:
        raw_data = request.get_json() or {}

    try:
        data = LaporanCreateSchema().load(raw_data)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    # Precheck (ref) sebelum upload foto bukti
    LaporanService.precheck_create(data)

    # Handle multiple foto_bukti uploads if present
    if 'foto_bukti_urls' in request.files:
        from app.lib.cloudinary import upload_images_concurrently
        files = request.files.getlist('foto_bukti_urls')
        uploaded_urls = upload_images_concurrently(files, folder="laporan_foto_bukti")
        
        if uploaded_urls:
            data['foto_bukti_urls'] = uploaded_urls

    item = LaporanService.create(request.current_user, data)
    return success_response(data=item.to_dict(), message="Laporan berhasil dibuat", status_code=201)


@jwt_required_custom
def update(item_id):
    # Support both JSON and multipart/form-data (for foto re-upload)
    if request.content_type and 'multipart/form-data' in request.content_type:
        raw_data = request.form.to_dict()
        if 'latitude' in raw_data and raw_data['latitude']:
            raw_data['latitude'] = float(raw_data['latitude'])
        if 'longitude' in raw_data and raw_data['longitude']:
            raw_data['longitude'] = float(raw_data['longitude'])
        if 'estimasi_berat_kg' in raw_data and raw_data['estimasi_berat_kg']:
            raw_data['estimasi_berat_kg'] = float(raw_data['estimasi_berat_kg'])
        if 'existing_foto_bukti' in request.form:
            raw_data['existing_foto_bukti'] = request.form.getlist('existing_foto_bukti')
    else:
        raw_data = request.get_json() or {}

    try:
        data = LaporanUpdateSchema().load(raw_data)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    # Precheck sebelum upload foto (akses + ref jika jenis_sampah_id diubah)
    LaporanService.precheck_update(item_id, request.current_user, data)

    # Check for existing photos kept by user
    existing_foto = request.form.getlist('existing_foto_bukti') if request.form else []
    if not request.form and 'existing_foto_bukti' in raw_data:
        existing_foto = raw_data.get('existing_foto_bukti', [])

    uploaded_urls = list(existing_foto)

    # Handle multiple new foto uploads
    if 'foto_bukti_urls' in request.files:
        from app.lib.cloudinary import upload_images_concurrently
        files = request.files.getlist('foto_bukti_urls')
        new_urls = upload_images_concurrently(files, folder="laporan_foto_bukti")
        uploaded_urls.extend(new_urls)

    # Update foto_bukti_urls if user touched photos
    if request.form and 'existing_foto_bukti' in request.form:
        data['foto_bukti_urls'] = uploaded_urls
    elif 'foto_bukti' in request.files:
        data['foto_bukti_urls'] = uploaded_urls

    update_data = {k: v for k, v in data.items() if v is not None}
    if not update_data:
        return error_response(message="Tidak ada data yang diubah", status_code=400)

    item = LaporanService.update(item_id, request.current_user, update_data)
    return success_response(data=item.to_dict(), message="Laporan berhasil diperbarui")


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
    # Support both JSON and multipart/form-data (for foto uploads)
    if request.content_type and 'multipart/form-data' in request.content_type:
        raw_data = request.form.to_dict()
    else:
        raw_data = request.get_json() or {}

    try:
        data = TindakLanjutCreateSchema().load(raw_data)
    except ValidationError as err:
        return error_response(
            message="Validasi gagal",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    # Handle foto_sebelum uploads
    if 'foto_sebelum_tindakan_urls' in request.files:
        from app.lib.cloudinary import upload_images_concurrently
        files = request.files.getlist('foto_sebelum_tindakan_urls')
        uploaded_urls = upload_images_concurrently(files, folder="tindak_lanjut_sebelum")
        if uploaded_urls:
            data['foto_sebelum_tindakan_urls'] = uploaded_urls

    # Handle foto_setelah uploads
    if 'foto_setelah_tindakan_urls' in request.files:
        from app.lib.cloudinary import upload_images_concurrently
        files = request.files.getlist('foto_setelah_tindakan_urls')
        uploaded_urls = upload_images_concurrently(files, folder="tindak_lanjut_setelah")
        if uploaded_urls:
            data['foto_setelah_tindakan_urls'] = uploaded_urls

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

    items, total = LaporanService.get_my_laporan(
        request.current_user.id,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        search=params.get('search'),
        status_laporan=params.get('status_laporan'),
        jenis_sampah_id=params.get('jenis_sampah_id'),
        sort_by=params.get('sort_by', 'created_at'),
        sort_order=params.get('sort_order', 'desc'),
    )

    return paginated_response(
        data=[item.to_dict() for item in items],
        total=total,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        message="Daftar laporan saya berhasil diambil"
    )