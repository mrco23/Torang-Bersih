"""Auth controller - Request handlers for auth endpoints"""
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from app.api.services.auth_service import AuthService
from app.schemas.auth_schema import (
    RegisterSchema, LoginSchema, ForgotPasswordSchema,
    ResetPasswordSchema, ChangePasswordSchema
)
from app.middlewares.auth_middleware import jwt_required_custom
from app.utils.response import success_response, error_response
from app.lib.mailer import send_verification_email, send_password_reset_email


def register():
    try:
        data = RegisterSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )
    
    user = AuthService.register(
        email=data['email'],
        username=data['username'],
        password=data['password'],
        full_name=data.get('full_name')
    )
    
    try:
        send_verification_email(user.email, user.verification_token)
    except Exception:
        pass
    
    return success_response(
        data=user.to_dict(),
        message="Registrasi berhasil. Silakan cek email untuk verifikasi akun kamu.",
        status_code=201
    )


def login():
    try:
        data = LoginSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )
    
    user, access_token, refresh_token = AuthService.login(
        email=data['email'],
        password=data['password']
    )
    
    return success_response(
        data={
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer'
        },
        message="Masuk berhasil"
    )


@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    access_token = AuthService.refresh_token(user_id)
    
    return success_response(
        data={'access_token': access_token, 'token_type': 'Bearer'},
        message="Token berhasil diperbarui"
    )


@jwt_required_custom
def logout():
    return success_response(message="Logout berhasil")


def verify_email(token):
    user = AuthService.verify_email(token)
    return success_response(data=user.to_dict(), message="Email berhasil diverifikasi")


def resend_verification():
    try:
        data = ForgotPasswordSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )
    
    user = AuthService.resend_verification(data['email'])
    
    try:
        send_verification_email(user.email, user.verification_token)
    except Exception:
        pass
    
    return success_response(message="Email verifikasi berhasil dikirim")


def forgot_password():
    try:
        data = ForgotPasswordSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )
    
    user = AuthService.forgot_password(data['email'])
    
    if user:
        try:
            send_password_reset_email(user.email, user.reset_token)
        except Exception:
            pass
    
    return success_response(
        message="Jika akun dengan email tersebut ada, link reset password telah dikirim"
    )


def reset_password():
    try:
        data = ResetPasswordSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )
    
    AuthService.reset_password(token=data['token'], new_password=data['password'])
    return success_response(message="Password berhasil direset")


@jwt_required_custom
def change_password():
    try:
        data = ChangePasswordSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )
    
    AuthService.change_password(
        user=request.current_user,
        current_password=data['current_password'],
        new_password=data['new_password']
    )
    
    return success_response(message="Password berhasil diubah")
