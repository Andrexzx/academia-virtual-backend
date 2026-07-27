"""Controlador (router) de Asignatura: define los endpoints REST."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.asignatura_service import AsignaturaService
from app.schemas.asignatura_schema import AsignaturaOut, AsignaturaCreate, AsignaturaUpdate
from app.schemas.common import ResponseRest, InfoRest

router = APIRouter(prefix="/v1/asignaturas", tags=["Asignaturas"])


def _error(mensaje: str) -> ResponseRest[AsignaturaOut]:
    return ResponseRest[AsignaturaOut](data=[], info_list=[InfoRest(codigo=2, mensaje=mensaje, estado=0)])


@router.get("", response_model=ResponseRest[AsignaturaOut])
def consultar(db: Session = Depends(get_db)):
    try:
        respuesta = AsignaturaService(db).consultar()
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.get("/{codigo}", response_model=ResponseRest[AsignaturaOut])
def consultar_por_id(codigo: str, db: Session = Depends(get_db)):
    try:
        respuesta = AsignaturaService(db).buscar_por_id(codigo)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.post("", response_model=ResponseRest[AsignaturaOut], status_code=201)
def crear(asignatura: AsignaturaCreate, db: Session = Depends(get_db)):
    try:
        respuesta = AsignaturaService(db).crear(asignatura)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.put("/{codigo}", response_model=ResponseRest[AsignaturaOut])
def actualizar(codigo: str, asignatura: AsignaturaUpdate, db: Session = Depends(get_db)):
    try:
        respuesta = AsignaturaService(db).modificar(codigo, asignatura)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.delete("/{codigo}", response_model=ResponseRest[AsignaturaOut])
def eliminar(codigo: str, db: Session = Depends(get_db)):
    try:
        respuesta = AsignaturaService(db).eliminar(codigo)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))
