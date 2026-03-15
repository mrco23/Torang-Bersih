"""User controller - Request handlers for user endpoints"""
from flask import request
from marshmallow import ValidationError

from app.api.services.user_service import UserService
from app.schemas.user_schema import (
    UpdateUserSchema, UpdateUserAdminSchema, UserListQuerySchema
)
from app.middlewares.auth_middleware import jwt_required_custom, admin_required
from app.utils.response import success_response, error_response, paginated_response


@jwt_required_custom
def get_me():
    return success_response(
        data=request.current_user.to_dict(),
        message="Profil berhasil diambil"
    )


@jwt_required_custom
def update_me():
    try:
        data = UpdateUserSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )
    
    update_data = {k: v for k, v in data.items() if v is not None}
    
    if update_data:
        user = UserService.update(request.current_user, **update_data)
    else:
        user = request.current_user
    
    return success_response(data=user.to_dict(), message="Profil berhasil diperbarui")


@jwt_required_custom
def upload_avatar():
    if 'avatar' not in request.files:
        return error_response(message="File tidak ditemukan", status_code=400)
    
    file = request.files['avatar']
    
    if file.filename == '':
        return error_response(message="Tidak ada file yang dipilih", status_code=400)
    
    from app.lib.cloudinary import upload_image
    
    # Upload to cloudinary
    upload_result = upload_image(
        file, 
        folder="avatars",
        public_id=f"user_{request.current_user.id}"
    )
    
    if not upload_result:
        return error_response(message="Gagal mengunggah gambar", status_code=500)
    
    user = UserService.upload_avatar(request.current_user, upload_result['url'])
    
    return success_response(data=user.to_dict(), message="Avatar berhasil diperbarui")


@admin_required
def get_users():
    try:
        query_params = UserListQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )
    
    users, total = UserService.get_all(
        page=query_params.get('page', 1),
        per_page=query_params.get('per_page', 20),
        search=query_params.get('search'),
        role=query_params.get('role'),
        is_verified=query_params.get('is_verified'),
        is_active=query_params.get('is_active'),
        sort_by=query_params.get('sort_by', 'created_at'),
        sort_order=query_params.get('sort_order', 'desc')
    )
    
    return paginated_response(
        data=[user.to_dict() for user in users],
        total=total,
        page=query_params.get('page', 1),
        per_page=query_params.get('per_page', 20),
        message="Daftar pengguna berhasil diambil"
    )


@admin_required
def get_user(user_id):
    user = UserService.get_by_id(user_id)
    return success_response(data=user.to_dict(), message="Data pengguna berhasil diambil")


@admin_required
def update_user(user_id):
    try:
        data = UpdateUserAdminSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )
    
    user = UserService.get_by_id(user_id)
    update_data = {k: v for k, v in data.items() if v is not None}
    
    if update_data:
        user = UserService.update(user, **update_data)
    
    return success_response(data=user.to_dict(), message="Pengguna berhasil diperbarui")


@admin_required
def delete_user(user_id):
    if user_id == request.current_user.id:
        return error_response(message="Tidak bisa menghapus akun sendiri", status_code=400)
    
    UserService.delete(user_id)
    return success_response(message="Pengguna berhasil dihapus")


@admin_required
def deactivate_user(user_id):
    if user_id == request.current_user.id:
        return error_response(message="Tidak bisa menonaktifkan akun sendiri", status_code=400)
    
    user = UserService.deactivate(user_id)
    return success_response(data=user.to_dict(), message="Pengguna berhasil dinonaktifkan")

@admin_required
def activate_user(user_id):
    if user_id == request.current_user.id:
        return error_response(message="Tidak bisa mengaktifkan akun sendiri", status_code=400)
    
    user = UserService.activate(user_id)
    return success_response(data=user.to_dict(), message="Pengguna berhasil diaktifkan")

