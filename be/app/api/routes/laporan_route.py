"""Laporan routes"""
from flask import Blueprint
from app.api.controllers import laporan_controller

laporan_bp = Blueprint('laporan', __name__, url_prefix='/api/laporan')


@laporan_bp.route('', methods=['GET'])
def get_all():
    return laporan_controller.get_all()


@laporan_bp.route('/<item_id>', methods=['GET'])
def get_one(item_id):
    return laporan_controller.get_one(item_id)


@laporan_bp.route('', methods=['POST'])
def create():
    return laporan_controller.create()


@laporan_bp.route('/<item_id>', methods=['PUT', 'PATCH'])
def update(item_id):
    return laporan_controller.update(item_id)


@laporan_bp.route('/<item_id>/status', methods=['PATCH'])
def update_status(item_id):
    return laporan_controller.update_status(item_id)


@laporan_bp.route('/<item_id>', methods=['DELETE'])
def delete(item_id):
    return laporan_controller.delete(item_id)


# Tindak Lanjut (nested under laporan)
@laporan_bp.route('/<laporan_id>/tindak-lanjut', methods=['GET'])
def get_tindak_lanjut(laporan_id):
    return laporan_controller.get_tindak_lanjut(laporan_id)


@laporan_bp.route('/<laporan_id>/tindak-lanjut', methods=['POST'])
def create_tindak_lanjut(laporan_id):
    return laporan_controller.create_tindak_lanjut(laporan_id)


@laporan_bp.route('/my-laporan', methods=['GET'])
def my_laporan():
    return laporan_controller.my_laporan()
