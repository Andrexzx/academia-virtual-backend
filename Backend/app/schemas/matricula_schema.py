"""Esquemas Pydantic de Matricula (entrada y salida de la API)."""
from datetime import date
from pydantic import BaseModel, ConfigDict


class MatriculaCreate(BaseModel):
    """Solicitud inicial de matrícula (paso 1 del diagrama de secuencia: 'Solicita matrícula')."""
    fecha: date
    id_estudiante: int
    id_grupo: int


class MatriculaOut(BaseModel):
    id_matricula: int
    fecha: date
    estado: str
    id_estudiante: int
    id_grupo: int

    model_config = ConfigDict(from_attributes=True)


class ValidarRequisitosIn(BaseModel):
    """Paso 6-7 del diagrama de secuencia: 'Validar requisitos' / 'Requisitos OK'."""
    aprobado: bool


class ConfirmarPagoIn(BaseModel):
    """Paso 8-9 del diagrama de secuencia: 'Generar pago' / 'Pago confirmado'."""
    pago_realizado: bool
