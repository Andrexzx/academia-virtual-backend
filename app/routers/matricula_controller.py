"""Controlador (router) de Matricula: CRUD + transiciones de estado del diagrama de estados."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.matricula_service import MatriculaService, TransicionInvalidaError
from app.schemas.matricula_schema import (
    MatriculaOut,
    MatriculaCreate,
    ValidarRequisitosIn,
    ConfirmarPagoIn,
)
from app.schemas.common import ResponseRest, InfoRest

router = APIRouter(prefix="/v1/matriculas", tags=["Matriculas"])


def _error(mensaje: str) -> ResponseRest[MatriculaOut]:
    return ResponseRest[MatriculaOut](data=[], info_list=[InfoRest(codigo=2, mensaje=mensaje, estado=0)])


@router.get("", response_model=ResponseRest[MatriculaOut])
def consultar(db: Session = Depends(get_db)):
    try:
        respuesta = MatriculaService(db).consultar()
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.get("/{id_matricula}", response_model=ResponseRest[MatriculaOut])
def consultar_por_id(id_matricula: int, db: Session = Depends(get_db)):
    try:
        respuesta = MatriculaService(db).buscar_por_id(id_matricula)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.post("", response_model=ResponseRest[MatriculaOut], status_code=201)
def crear(matricula: MatriculaCreate, db: Session = Depends(get_db)):
    """Paso 1 del diagrama de secuencia: el estudiante solicita la matrícula."""
    try:
        respuesta = MatriculaService(db).crear(matricula)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except Exception as error:
        return _error(str(error))


@router.post("/{id_matricula}/validar", response_model=ResponseRest[MatriculaOut])
def validar_requisitos(id_matricula: int, body: ValidarRequisitosIn, db: Session = Depends(get_db)):
    """Pasos 6-7 de la secuencia: Validación Académica -> Pendiente pago / Cancelado."""
    try:
        respuesta = MatriculaService(db).validar_requisitos(id_matricula, body.aprobado)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except TransicionInvalidaError as error:
        return _error(str(error))
    except Exception as error:
        return _error(str(error))


@router.post("/{id_matricula}/pago", response_model=ResponseRest[MatriculaOut])
def confirmar_pago(id_matricula: int, body: ConfirmarPagoIn, db: Session = Depends(get_db)):
    """Pasos 8-9 de la secuencia: Generar pago / Pago confirmado -> Matriculado / Anulado."""
    try:
        respuesta = MatriculaService(db).confirmar_pago(id_matricula, body.pago_realizado)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except TransicionInvalidaError as error:
        return _error(str(error))
    except Exception as error:
        return _error(str(error))


@router.post("/{id_matricula}/activar", response_model=ResponseRest[MatriculaOut])
def activar(id_matricula: int, db: Session = Depends(get_db)):
    """Matriculado -> Activo."""
    try:
        respuesta = MatriculaService(db).activar(id_matricula)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except TransicionInvalidaError as error:
        return _error(str(error))
    except Exception as error:
        return _error(str(error))


@router.post("/{id_matricula}/finalizar", response_model=ResponseRest[MatriculaOut])
def finalizar(id_matricula: int, db: Session = Depends(get_db)):
    """Activo -> Finalizado (cierre de período)."""
    try:
        respuesta = MatriculaService(db).finalizar(id_matricula)
        respuesta.info_list.append(InfoRest(codigo=1, mensaje="Respuesta Ok", estado=1))
        return respuesta
    except TransicionInvalidaError as error:
        return _error(str(error))
    except Exception as error:
        return _error(str(error))
