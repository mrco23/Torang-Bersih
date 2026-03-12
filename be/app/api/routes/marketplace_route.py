"""Marketplace routes"""
from flask import Blueprint
from app.api.controllers import marketplace_controller

marketplace_bp = Blueprint('marketplace', __name__, url_prefix='/api/marketplace')


@marketplace_bp.route('', methods=['GET'])
def get_all():
    return marketplace_controller.get_all()


@marketplace_bp.route('/<item_id>', methods=['GET'])
def get_one(item_id):
    return marketplace_controller.get_one(item_id)


@marketplace_bp.route('', methods=['POST'])
def create():
    return marketplace_controller.create()


@marketplace_bp.route('/<item_id>', methods=['PUT', 'PATCH'])
def update(item_id):
    return marketplace_controller.update(item_id)


@marketplace_bp.route('/<item_id>', methods=['DELETE'])
def delete(item_id):
    return marketplace_controller.delete(item_id)


@marketplace_bp.route('/<item_id>/update-ketersediaan', methods=['PATCH'])
def update_ketersediaan(item_id):
    return marketplace_controller.update_ketersediaan(item_id)


@marketplace_bp.route('/my-marketplace', methods=['GET'])
def my_marketplace():
    return marketplace_controller.my_marketplace()
