"""Esquemas Pydantic de Calificacion (entrada y salida de la API)."""
from typing import Optional
from pydantic import BaseModel, ConfigDict


class CalificacionBase(BaseModel):
    parcial1: float
    parcial2: float
    examen_final: float
    id_estudiante: int
    cod_asignatura: str


class CalificacionCreate(CalificacionBase):
    pass


class CalificacionUpdate(CalificacionBase):
    pass


class CalificacionOut(CalificacionBase):
    id_calificacion: int
    promedio: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)
