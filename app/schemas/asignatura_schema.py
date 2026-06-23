"""Esquemas Pydantic de Asignatura (entrada y salida de la API)."""
from pydantic import BaseModel, ConfigDict


class AsignaturaBase(BaseModel):
    nombre: str
    creditos: int
    nivel: str


class AsignaturaCreate(AsignaturaBase):
    codigo: str


class AsignaturaUpdate(AsignaturaBase):
    pass


class AsignaturaOut(AsignaturaBase):
    codigo: str

    model_config = ConfigDict(from_attributes=True)
