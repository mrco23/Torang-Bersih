"""Aset routes"""
from flask import Blueprint
from app.api.controllers import aset_controller

aset_bp = Blueprint('aset', __name__, url_prefix='/api/aset')


@aset_bp.route('', methods=['GET'])
def get_all():
    return aset_controller.get_all()


@aset_bp.route('/<item_id>', methods=['GET'])
def get_one(item_id):
    return aset_controller.get_one(item_id)


@aset_bp.route('', methods=['POST'])
def create():
    return aset_controller.create()


@aset_bp.route('/<item_id>', methods=['PUT', 'PATCH'])
def update(item_id):
    return aset_controller.update(item_id)


@aset_bp.route('/<item_id>', methods=['DELETE'])
def delete(item_id):
    return aset_controller.delete(item_id)


@aset_bp.route('/<item_id>/verify', methods=['PATCH'])
def verify(item_id):
    return aset_controller.verify(item_id)


@aset_bp.route('/my-aset', methods=['GET'])
def my_aset():
    return aset_controller.my_aset()