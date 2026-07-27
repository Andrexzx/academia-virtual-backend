"""Controlador (router) de Docente: define los endpoints REST."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.docente_service import DocenteService
from app.schemas.docente_schema import DocenteOut, DocenteCreate, DocenteUpdate
from app.schemas.common import ResponseRest, InfoRest

router = APIRouter(prefix="/v1/docentes", tags=["Docentes"])


def _error(mensaje: str) -> ResponseRest[DocenteOut]:
    return ResponseRest[DocenteOut](data=[], info_list=[InfoRest(codigo=2, mensaje=mensaje, estado=0)])


@router.get("", response_model=ResponseRest[DocenteOut])
def consultar(db: Session = Depends(get_db)):
    try:
        respuesta = DocenteService(db).consultar()
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.get("/{id_docente}", response_model=ResponseRest[DocenteOut])
def consultar_por_id(id_docente: int, db: Session = Depends(get_db)):
    try:
        respuesta = DocenteService(db).buscar_por_id(id_docente)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.post("", response_model=ResponseRest[DocenteOut], status_code=201)
def crear(docente: DocenteCreate, db: Session = Depends(get_db)):
    try:
        respuesta = DocenteService(db).crear(docente)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.put("/{id_docente}", response_model=ResponseRest[DocenteOut])
def actualizar(id_docente: int, docente: DocenteUpdate, db: Session = Depends(get_db)):
    try:
        respuesta = DocenteService(db).modificar(id_docente, docente)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.delete("/{id_docente}", response_model=ResponseRest[DocenteOut])
def eliminar(id_docente: int, db: Session = Depends(get_db)):
    try:
        respuesta = DocenteService(db).eliminar(id_docente)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))
