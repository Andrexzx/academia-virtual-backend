"""Controlador (router) de Grupo: define los endpoints REST."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.grupo_service import GrupoService
from app.schemas.grupo_schema import GrupoOut, GrupoCreate, GrupoUpdate
from app.schemas.common import ResponseRest, InfoRest

router = APIRouter(prefix="/v1/grupos", tags=["Grupos"])


def _error(mensaje: str) -> ResponseRest[GrupoOut]:
    return ResponseRest[GrupoOut](data=[], info_list=[InfoRest(codigo=2, mensaje=mensaje, estado=0)])


@router.get("", response_model=ResponseRest[GrupoOut])
def consultar(db: Session = Depends(get_db)):
    try:
        respuesta = GrupoService(db).consultar()
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.get("/{id_grupo}", response_model=ResponseRest[GrupoOut])
def consultar_por_id(id_grupo: int, db: Session = Depends(get_db)):
    try:
        respuesta = GrupoService(db).buscar_por_id(id_grupo)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.post("", response_model=ResponseRest[GrupoOut], status_code=201)
def crear(grupo: GrupoCreate, db: Session = Depends(get_db)):
    try:
        respuesta = GrupoService(db).crear(grupo)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.put("/{id_grupo}", response_model=ResponseRest[GrupoOut])
def actualizar(id_grupo: int, grupo: GrupoUpdate, db: Session = Depends(get_db)):
    try:
        respuesta = GrupoService(db).modificar(id_grupo, grupo)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.delete("/{id_grupo}", response_model=ResponseRest[GrupoOut])
def eliminar(id_grupo: int, db: Session = Depends(get_db)):
    try:
        respuesta = GrupoService(db).eliminar(id_grupo)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))
