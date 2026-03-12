"""Kolaborator routes"""
from flask import Blueprint
from app.api.controllers import kolaborator_controller

kolaborator_bp = Blueprint('kolaborator', __name__, url_prefix='/api/kolaborator')


@kolaborator_bp.route('', methods=['GET'])
def get_all():
    return kolaborator_controller.get_all()


@kolaborator_bp.route('/<item_id>', methods=['GET'])
def get_one(item_id):
    return kolaborator_controller.get_one(item_id)


@kolaborator_bp.route('', methods=['POST'])
def create():
    return kolaborator_controller.create()


@kolaborator_bp.route('/<item_id>', methods=['PUT', 'PATCH'])
def update(item_id):
    return kolaborator_controller.update(item_id)


@kolaborator_bp.route('/<item_id>', methods=['DELETE'])
def delete(item_id):
    return kolaborator_controller.delete(item_id)


@kolaborator_bp.route('/<item_id>/verify', methods=['PATCH'])
def verify(item_id):
    return kolaborator_controller.verify(item_id)


@kolaborator_bp.route('/my-kolaborator', methods=['GET'])
def my_kolaborator():
    return kolaborator_controller.my_kolaborator()
