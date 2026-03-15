"""Peta controller - Map markers endpoint"""
from flask import request
from marshmallow import ValidationError

from app.api.services.peta_service import PetaService
from app.schemas.peta_schema import PetaQuerySchema
from app.utils.response import success_response, error_response


def get_markers():
    try:
        params = PetaQuerySchema().load(request.args)
    except ValidationError as err:
        return error_response(
            message=f"Validasi gagal: {', '.join([f'Kolom {k} tidak dikenal' if 'tidak dikenal' in v[0].lower() or 'unknown field' in v[0].lower() else v[0] for k, v in err.messages.items()])}",
            errors=[{"field": k, "message": v[0]} for k, v in err.messages.items()],
            status_code=422
        )
    types = params.get('types')
    if types:
        requested = [t.strip() for t in types.split(',') if t.strip()]
        allowed = {'Kolaborator', 'Aset', 'Laporan Sampah', 'Barang Daur Ulang'}
        types = [t for t in requested if t in allowed] or []
    else:
        types = None
    markers = PetaService.get_markers(types)
    return success_response(
        data=markers,
        message=f"{len(markers)} marker berhasil diambil"
    )
