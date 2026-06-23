"""Esquemas Pydantic de Grupo (entrada y salida de la API)."""
from pydantic import BaseModel, ConfigDict


class GrupoBase(BaseModel):
    modalidad: str
    horario: str
    cupo_maximo: int
    id_docente: int
    cod_asignatura: str


class GrupoCreate(GrupoBase):
    pass


class GrupoUpdate(GrupoBase):
    pass


class GrupoOut(GrupoBase):
    id_grupo: int

    model_config = ConfigDict(from_attributes=True)
