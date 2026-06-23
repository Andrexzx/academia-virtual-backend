"""
Envoltorio de respuesta estándar para todos los servicios.

Es el equivalente directo de ResponseRest<T> + InfoRest del proyecto
de ejemplo en Spring Boot (poo-servicio02-springboot):

    - data: lista con el(los) recurso(s) solicitados.
    - info_list: lista de mensajes informativos o de error.
        codigo: 1 = informativo, 2 = error
        estado: 1 = OK, 0 = error
"""
from typing import Generic, TypeVar, List
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class InfoRest(BaseModel):
    codigo: int
    mensaje: str
    estado: int


class ResponseRest(BaseModel, Generic[T]):
    data: List[T] = []
    info_list: List[InfoRest] = []

    model_config = ConfigDict(arbitrary_types_allowed=True)
