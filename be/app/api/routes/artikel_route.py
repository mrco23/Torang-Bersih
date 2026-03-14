from flask import Blueprint
from app.api.controllers import artikel_controller

artikel_bp = Blueprint('artikel', __name__, url_prefix='/api/artikel')

@artikel_bp.route('', methods=['GET'])
def get_all():
    return artikel_controller.get_all()

@artikel_bp.route('/popular', methods=['GET'])
def get_popular():
    return artikel_controller.get_popular()

@artikel_bp.route('/tags', methods=['GET'])
def get_tags():
    return artikel_controller.get_tags()


@artikel_bp.route('/my-artikel', methods=['GET'])
def my_artikel():
    return artikel_controller.my_artikel()

@artikel_bp.route('/<item_id>', methods=['GET'])
def get_one(item_id):
    return artikel_controller.get_one(item_id)

@artikel_bp.route('', methods=['POST'])
def create():
    return artikel_controller.create()

@artikel_bp.route('/<item_id>', methods=['PUT', 'PATCH'])
def update(item_id):
    return artikel_controller.update(item_id)

@artikel_bp.route('/<item_id>', methods=['DELETE'])
def delete(item_id):
    return artikel_controller.delete(item_id)

# Like
@artikel_bp.route('/<item_id>/like', methods=['POST'])
def toggle_like(item_id):
    return artikel_controller.toggle_like(item_id)

# Komentar
@artikel_bp.route('/<item_id>/komentar', methods=['GET'])
def get_komentar(item_id):
    return artikel_controller.get_komentar(item_id)

@artikel_bp.route('/<item_id>/komentar', methods=['POST'])
def create_komentar(item_id):
    return artikel_controller.create_komentar(item_id)

@artikel_bp.route('/<item_id>/komentar/<komentar_id>', methods=['PUT', 'PATCH'])
def update_komentar(item_id, komentar_id):
    return artikel_controller.update_komentar(item_id, komentar_id)

@artikel_bp.route('/<item_id>/komentar/<komentar_id>', methods=['DELETE'])
def delete_komentar(item_id, komentar_id):
    return artikel_controller.delete_komentar(item_id, komentar_id)