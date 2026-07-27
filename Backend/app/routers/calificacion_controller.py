"""Controlador (router) de Calificacion: define los endpoints REST."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.calificacion_service import CalificacionService
from app.schemas.calificacion_schema import CalificacionOut, CalificacionCreate, CalificacionUpdate
from app.schemas.common import ResponseRest, InfoRest

router = APIRouter(prefix="/v1/calificaciones", tags=["Calificaciones"])


def _error(mensaje: str) -> ResponseRest[CalificacionOut]:
    return ResponseRest[CalificacionOut](data=[], info_list=[InfoRest(codigo=2, mensaje=mensaje, estado=0)])


@router.get("", response_model=ResponseRest[CalificacionOut])
def consultar(db: Session = Depends(get_db)):
    try:
        respuesta = CalificacionService(db).consultar()
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.get("/{id_calificacion}", response_model=ResponseRest[CalificacionOut])
def consultar_por_id(id_calificacion: int, db: Session = Depends(get_db)):
    try:
        respuesta = CalificacionService(db).buscar_por_id(id_calificacion)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.post("", response_model=ResponseRest[CalificacionOut], status_code=201)
def crear(calificacion: CalificacionCreate, db: Session = Depends(get_db)):
    try:
        respuesta = CalificacionService(db).crear(calificacion)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.put("/{id_calificacion}", response_model=ResponseRest[CalificacionOut])
def actualizar(id_calificacion: int, calificacion: CalificacionUpdate, db: Session = Depends(get_db)):
    try:
        respuesta = CalificacionService(db).modificar(id_calificacion, calificacion)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.delete("/{id_calificacion}", response_model=ResponseRest[CalificacionOut])
def eliminar(id_calificacion: int, db: Session = Depends(get_db)):
    try:
        respuesta = CalificacionService(db).eliminar(id_calificacion)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))
