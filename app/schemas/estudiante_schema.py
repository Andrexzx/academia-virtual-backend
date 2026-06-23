"""Esquemas Pydantic de Estudiante (entrada y salida de la API)."""
from pydantic import BaseModel, ConfigDict


class EstudianteBase(BaseModel):
    cedula: str
    nombre: str
    direccion: str
    telefono: str


class EstudianteCreate(EstudianteBase):
    pass


class EstudianteUpdate(EstudianteBase):
    pass


class EstudianteOut(EstudianteBase):
    id_estudiante: int

    model_config = ConfigDict(from_attributes=True)
