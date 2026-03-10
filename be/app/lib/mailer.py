"""Email service using Flask-Mail"""
from flask import current_app, render_template_string
from flask_mail import Message

from app.config.extensions import mail
from app.utils.logger import logger


def send_email(to, subject, html_body, text_body=None):
    try:
        msg = Message(
            subject=subject,
            recipients=[to],
            html=html_body,
            body=text_body or "Silakan buka email ini di aplikasi yang mendukung HTML."
        )
        mail.send(msg)
        logger.info(f"Email sent to {to}: {subject}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {e}")
        return False


VERIFICATION_EMAIL_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Verifikasi Email Kamu</h1>
        <p>Terima kasih telah mendaftar. Silakan klik tombol di bawah ini untuk memverifikasi alamat email kamu:</p>
        <a href="{{ verification_url }}" class="button">Verifikasi Email</a>
        <p>Atau salin link ini: {{ verification_url }}</p>
        <p>Link ini akan kedaluwarsa dalam 24 jam.</p>
    </div>
</body>
</html>
"""

def send_verification_email(to, token):
    base_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
    verification_url = f"{base_url}/verify-email?token={token}"
    
    html_body = render_template_string(VERIFICATION_EMAIL_TEMPLATE, verification_url=verification_url)
    return send_email(to=to, subject="Verifikasi Email Kamu", html_body=html_body)


PASSWORD_RESET_EMAIL_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white !important; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Reset Password Kamu</h1>
        <p>Klik tombol di bawah ini untuk membuat password baru:</p>
        <a href="{{ reset_url }}" class="button">Reset Password</a>
        <p>Atau salin link ini: {{ reset_url }}</p>
        <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
    </div>
</body>
</html>
"""

def send_password_reset_email(to, token):
    base_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
    reset_url = f"{base_url}/reset-password?token={token}"
    
    html_body = render_template_string(PASSWORD_RESET_EMAIL_TEMPLATE, reset_url=reset_url)
    return send_email(to=to, subject="Reset Password Kamu", html_body=html_body)


KOLABORATOR_VERIFIED_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; }
        .success-icon { font-size: 48px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #16A34A; color: white !important; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        .info-box { background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 16px; margin: 16px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✅</div>
            <h1>Kolaborator Terverifikasi!</h1>
        </div>
        <p>Selamat! Kolaborator <strong>{{ nama_organisasi }}</strong> telah berhasil diverifikasi oleh admin.</p>
        <div class="info-box">
            <p>Kolaborator kamu sekarang sudah tampil sebagai kolaborator terverifikasi di platform kami.</p>
        </div>
        <p>Klik tombol di bawah ini untuk melihat halaman detail kolaborator kamu:</p>
        <a href="{{ detail_url }}" class="button">Lihat Detail Kolaborator</a>
        <p>Atau salin link ini: {{ detail_url }}</p>
        <div class="footer">
            <p>Email ini dikirim secara otomatis oleh sistem Proxo Coris.</p>
        </div>
    </div>
</body>
</html>
"""


def send_kolaborator_verified_email(to, kolaborator):
    base_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
    detail_url = f"{base_url}/kolaborator/{kolaborator.id}"

    html_body = render_template_string(
        KOLABORATOR_VERIFIED_TEMPLATE,
        nama_organisasi=kolaborator.nama_organisasi,
        detail_url=detail_url,
    )
    return send_email(
        to=to,
        subject=f"Kolaborator {kolaborator.nama_organisasi} Telah Diverifikasi",
        html_body=html_body,
    )
