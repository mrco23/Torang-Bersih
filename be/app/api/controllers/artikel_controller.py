"""Artikel controller - Request handlers for artikel endpoints"""
from flask import request
from marshmallow import ValidationError

from app.api.services.artikel_service import ArtikelService
from app.schemas.artikel_schema import (
    ArtikelCreateSchema, ArtikelUpdateSchema, ArtikelQuerySchema, MyArtikelQuerySchema,
    ArtikelKomentarCreateSchema, ArtikelKomentarUpdateSchema, ArtikelKomentarQuerySchema
)
from app.middlewares.auth_middleware import jwt_required_custom, optional_jwt
from app.utils.response import success_response, error_response, paginated_response

@optional_jwt
def get_all():
    try:
        params = ArtikelQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    items, total = ArtikelService.get_all(
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        search=params.get('search'),
        kategori_id=params.get('kategori_id'),
        status_publikasi=params.get('status_publikasi'),
        tag=params.get('tag'),
        sort_by=params.get('sort_by', 'created_at'),
        sort_order=params.get('sort_order', 'desc'),
    )

    current_user_id = request.current_user.id if request.current_user else None
    
    return paginated_response(
        data=[item.to_dict(include_content=False, current_user_id=current_user_id) for item in items],
        total=total,
        page=params.get('page', 1),
        per_page=params.get('per_page', 20),
        message="Daftar artikel berhasil diambil"
    )

@optional_jwt
def get_one(item_id):
    item = ArtikelService.get_by_id(item_id, increment_view=True)
    current_user_id = request.current_user.id if request.current_user else None
    return success_response(
        data=item.to_dict(include_content=True, current_user_id=current_user_id), 
        message="Detail artikel berhasil diambil"
    )

@optional_jwt
def get_popular():
    items = ArtikelService.get_popular(limit=3)
    current_user_id = request.current_user.id if request.current_user else None
    return success_response(
        data=[item.to_dict(include_content=False, current_user_id=current_user_id) for item in items],
        message="Artikel populer berhasil diambil"
    )

def get_tags():
    tags = ArtikelService.get_unique_tags()
    return success_response(
        data=tags,
        message="Daftar tag berhasil diambil"
    )


@jwt_required_custom
def my_artikel():
    try:
        # Menggunakan MyArtikelQuerySchema untuk validasi params pagination
        params = MyArtikelQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
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
        data=[item.to_dict(include_content=False) for item in items],
        total=total,
        page=page,
        per_page=per_page,
        message="Daftar artikel saya berhasil diambil"
    )

@jwt_required_custom
def create():
    if request.content_type and 'multipart/form-data' in request.content_type:
        raw_data = request.form.to_dict()
        # Handle lists and booleans from form-data
        tags = request.form.getlist('tags') or request.form.getlist('tags[]')
        if tags:
            raw_data['tags'] = tags
            
        if 'is_featured' in raw_data:
            val = str(raw_data['is_featured']).lower()
            raw_data['is_featured'] = val in ['true', '1', 'yes']
    else:
        raw_data = request.get_json() or {}

    try:
        data = ArtikelCreateSchema().load(raw_data)
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    # Handle foto cover upload
    if 'foto_cover' in request.files:
        foto_file = request.files['foto_cover']
        if foto_file.filename:
            from app.lib.cloudinary import upload_image
            upload_result = upload_image(
                foto_file,
                folder="artikel_covers",
                transformation={"width": 1200, "height": 630, "crop": "fill"}
            )
            if upload_result:
                data['foto_cover_url'] = upload_result['url']
            else:
                return error_response(message="Gagal mengunggah foto cover", status_code=500)

    item = ArtikelService.create(request.current_user, data)
    return success_response(
        data=item.to_dict(include_content=True), 
        message="Artikel berhasil dibuat", 
        status_code=201
    )

@jwt_required_custom
def update(item_id):
    if request.content_type and 'multipart/form-data' in request.content_type:
        raw_data = request.form.to_dict()
        tags = request.form.getlist('tags') or request.form.getlist('tags[]')
        if tags:
            raw_data['tags'] = tags
            
        if 'is_featured' in raw_data:
            val = str(raw_data['is_featured']).lower()
            raw_data['is_featured'] = val in ['true', '1', 'yes']
    else:
        raw_data = request.get_json() or {}

    try:
        data = ArtikelUpdateSchema().load(raw_data)
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    # Handle foto cover upload
    if 'foto_cover' in request.files:
        foto_file = request.files['foto_cover']
        if foto_file.filename:
            from app.lib.cloudinary import upload_image
            upload_result = upload_image(
                foto_file,
                folder="artikel_covers",
                transformation={"width": 1200, "height": 630, "crop": "fill"}
            )
            if upload_result:
                data['foto_cover_url'] = upload_result['url']
            else:
                return error_response(message="Gagal mengunggah foto cover", status_code=500)

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


# ------------------------------------------------------------------ #
#  LIKE
# ------------------------------------------------------------------ #
@jwt_required_custom
def toggle_like(item_id):
    liked, jumlah_like = ArtikelService.toggle_like(item_id, request.current_user)
    return success_response(
        data={'liked': liked, 'jumlah_like': jumlah_like},
        message="Like berhasil" if liked else "Like dibatalkan"
    )


# ------------------------------------------------------------------ #
#  KOMENTAR
# ------------------------------------------------------------------ #
def get_komentar(item_id):
    try:
        params = ArtikelKomentarQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    page = params.get('page', 1)
    per_page = params.get('per_page', 20)
    items, total = ArtikelService.get_komentar(item_id, page=page, per_page=per_page)

    return paginated_response(
        data=[item.to_dict() for item in items],
        total=total,
        page=page,
        per_page=per_page,
        message="Komentar berhasil diambil"
    )


@jwt_required_custom
def create_komentar(item_id):
    try:
        data = ArtikelKomentarCreateSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    komentar = ArtikelService.create_komentar(item_id, request.current_user, data)
    return success_response(
        data=komentar.to_dict(),
        message="Komentar berhasil dibuat",
        status_code=201
    )


@jwt_required_custom
def update_komentar(item_id, komentar_id):
    try:
        data = ArtikelKomentarUpdateSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    komentar = ArtikelService.update_komentar(komentar_id, request.current_user, data)
    return success_response(
        data=komentar.to_dict(),
        message="Komentar berhasil diperbarui"
    )


@jwt_required_custom
def delete_komentar(item_id, komentar_id):
    ArtikelService.delete_komentar(komentar_id, request.current_user)
    return success_response(message="Komentar berhasil dihapus")
