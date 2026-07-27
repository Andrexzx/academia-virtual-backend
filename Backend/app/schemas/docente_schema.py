"""Esquemas Pydantic de Docente (entrada y salida de la API)."""
from pydantic import BaseModel, ConfigDict


class DocenteBase(BaseModel):
    titulo: str
    especialidad: str
    experiencia: int


class DocenteCreate(DocenteBase):
    pass


class DocenteUpdate(DocenteBase):
    pass


class DocenteOut(DocenteBase):
    id_docente: int

    model_config = ConfigDict(from_attributes=True)
