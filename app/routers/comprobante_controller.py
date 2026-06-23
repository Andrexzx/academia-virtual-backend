"""Controlador (router) de Comprobante: define los endpoints REST."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.comprobante_service import ComprobanteService
from app.schemas.comprobante_schema import ComprobanteOut, ComprobanteCreate
from app.schemas.common import ResponseRest, InfoRest

router = APIRouter(prefix="/v1/comprobantes", tags=["Comprobantes"])


def _error(mensaje: str) -> ResponseRest[ComprobanteOut]:
    return ResponseRest[ComprobanteOut](data=[], info_list=[InfoRest(codigo=2, mensaje=mensaje, estado=0)])


@router.get("", response_model=ResponseRest[ComprobanteOut])
def consultar(db: Session = Depends(get_db)):
    try:
        respuesta = ComprobanteService(db).consultar()
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.get("/{id_comprobante}", response_model=ResponseRest[ComprobanteOut])
def consultar_por_id(id_comprobante: int, db: Session = Depends(get_db)):
    try:
        respuesta = ComprobanteService(db).buscar_por_id(id_comprobante)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.post("", response_model=ResponseRest[ComprobanteOut], status_code=201)
def crear(comprobante: ComprobanteCreate, db: Session = Depends(get_db)):
    """
    Emite el comprobante de una matrícula calculando IVA y total
    automáticamente a partir del subtotal (SRS 2.9).
    """
    try:
        respuesta = ComprobanteService(db).crear(comprobante)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))
