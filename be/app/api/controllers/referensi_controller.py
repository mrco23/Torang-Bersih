"""Referensi controller - Request handlers for reference/lookup endpoints"""
from flask import request
from marshmallow import ValidationError

from app.api.services.referensi_service import ReferensiService
from app.schemas.referensi_schema import ReferensiCreateSchema, ReferensiUpdateSchema
from app.middlewares.auth_middleware import admin_required
from app.utils.response import success_response, error_response
from app.utils.exceptions import BadRequestError
from app.database.models import (
    RefJenisKolaborator, RefKategoriAset, RefJenisSampah,
    RefKategoriBarang, RefKategoriArtikel
)

# Mapping tipe URL → model class
TIPE_MODEL_MAP = {
    'jenis-kolaborator': RefJenisKolaborator,
    'kategori-aset': RefKategoriAset,
    'jenis-sampah': RefJenisSampah,
    'kategori-barang': RefKategoriBarang,
    'kategori-artikel': RefKategoriArtikel,
}

TIPE_LABELS = {
    'jenis-kolaborator': 'Jenis Kolaborator',
    'kategori-aset': 'Kategori Aset',
    'jenis-sampah': 'Jenis Sampah',
    'kategori-barang': 'Kategori Barang',
    'kategori-artikel': 'Kategori Artikel',
}


def _get_model(tipe):
    model = TIPE_MODEL_MAP.get(tipe)
    if not model:
        tipe_list = ', '.join(TIPE_MODEL_MAP.keys())
        raise BadRequestError(f"Tipe '{tipe}' tidak valid. Pilihan: {tipe_list}")
    return model


def get_all(tipe):
    model = _get_model(tipe)
    include_inactive = request.args.get('include_inactive', 'false').lower() == 'true'
    items = ReferensiService.get_all(model, include_inactive=include_inactive)
    label = TIPE_LABELS.get(tipe, tipe)

    return success_response(
        data=[item.to_dict() for item in items],
        message=f"Daftar {label} berhasil diambil"
    )


@admin_required
def create(tipe):
    model = _get_model(tipe)
    label = TIPE_LABELS.get(tipe, tipe)

    try:
        data = ReferensiCreateSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    item = ReferensiService.create(model, data)
    return success_response(
        data=item.to_dict(),
        message=f"{label} berhasil ditambahkan",
        status_code=201
    )


@admin_required
def update(tipe, item_id):
    model = _get_model(tipe)
    label = TIPE_LABELS.get(tipe, tipe)

    try:
        data = ReferensiUpdateSchema().load(request.get_json() or {})
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )

    update_data = {k: v for k, v in data.items() if v is not None}
    if not update_data:
        return error_response(message="Tidak ada data yang diubah", status_code=400)

    item = ReferensiService.update(model, item_id, update_data)
    return success_response(
        data=item.to_dict(),
        message=f"{label} berhasil diperbarui"
    )


@admin_required
def delete(tipe, item_id):
    model = _get_model(tipe)
    label = TIPE_LABELS.get(tipe, tipe)

    ReferensiService.delete(model, item_id)
    return success_response(message=f"{label} berhasil dinonaktifkan")
