from flask import Flask
from app.api.routes.auth_route import auth_bp
from app.api.routes.user_route import user_bp
from app.api.routes.social_auth_route import social_auth_bp
from app.api.routes.referensi_route import referensi_bp
from app.api.routes.kolaborator_route import kolaborator_bp
from app.api.routes.aset_route import aset_bp
from app.api.routes.laporan_route import laporan_bp
from app.api.routes.marketplace_route import marketplace_bp
from app.api.routes.dashboard_route import dashboard_bp
from app.api.routes.peta_route import peta_bp
from app.api.routes.artikel_route import artikel_bp

def register_routes(app: Flask) -> None:
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(social_auth_bp)
    app.register_blueprint(referensi_bp)
    app.register_blueprint(kolaborator_bp)
    app.register_blueprint(aset_bp)
    app.register_blueprint(laporan_bp)
    app.register_blueprint(marketplace_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(peta_bp)
    app.register_blueprint(artikel_bp)