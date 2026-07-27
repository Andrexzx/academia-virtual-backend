"""Controlador (router) de Estudiante: define los endpoints REST."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.estudiante_service import EstudianteService
from app.schemas.estudiante_schema import EstudianteOut, EstudianteCreate, EstudianteUpdate
from app.schemas.common import ResponseRest, InfoRest

router = APIRouter(prefix="/v1/estudiantes", tags=["Estudiantes"])


def _error(mensaje: str) -> ResponseRest[EstudianteOut]:
    return ResponseRest[EstudianteOut](data=[], info_list=[InfoRest(codigo=2, mensaje=mensaje, estado=0)])


@router.get("", response_model=ResponseRest[EstudianteOut])
def consultar(db: Session = Depends(get_db)):
    try:
        respuesta = EstudianteService(db).consultar()
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.get("/{id_estudiante}", response_model=ResponseRest[EstudianteOut])
def consultar_por_id(id_estudiante: int, db: Session = Depends(get_db)):
    try:
        respuesta = EstudianteService(db).buscar_por_id(id_estudiante)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.post("", response_model=ResponseRest[EstudianteOut], status_code=201)
def crear(estudiante: EstudianteCreate, db: Session = Depends(get_db)):
    try:
        respuesta = EstudianteService(db).crear(estudiante)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.put("/{id_estudiante}", response_model=ResponseRest[EstudianteOut])
def actualizar(id_estudiante: int, estudiante: EstudianteUpdate, db: Session = Depends(get_db)):
    try:
        respuesta = EstudianteService(db).modificar(id_estudiante, estudiante)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.delete("/{id_estudiante}", response_model=ResponseRest[EstudianteOut])
def eliminar(id_estudiante: int, db: Session = Depends(get_db)):
    try:
        respuesta = EstudianteService(db).eliminar(id_estudiante)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))
