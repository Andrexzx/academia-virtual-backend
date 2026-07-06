"""
Servicio de Calificacion.

Además del CRUD estándar, implementa el requerimiento 2.6.1 de la SRS:
"El sistema debe aplicar automáticamente las fórmulas de ponderación
configuradas para calcular el promedio final y el estado de aprobación."

Ponderación usada (ajustable según lo que definan como regla institucional):
    parcial1 30% + parcial2 30% + examen_final 40%
"""
from sqlalchemy.orm import Session
from app.models.calificacion import Calificacion
from app.repositories.calificacion_repository import CalificacionRepository
from app.schemas.common import InfoRest, ResponseRest
from app.schemas.calificacion_schema import CalificacionOut, CalificacionCreate, CalificacionUpdate

PESO_PARCIAL1 = 0.3
PESO_PARCIAL2 = 0.3
PESO_EXAMEN_FINAL = 0.4
NOTA_MINIMA_APROBACION = 7.0


def calcular_promedio(parcial1: float, parcial2: float, examen_final: float) -> float:
    """
    Calcula el promedio ponderado (parcial1 30%, parcial2 30%, examen_final 40%).

    >>> calcular_promedio(10.0, 10.0, 10.0)
    10.0
    >>> calcular_promedio(7.0, 8.0, 6.0)
    6.9
    >>> calcular_promedio(5.0, 6.0, 8.0)
    6.5
    """
    return round(
        parcial1 * PESO_PARCIAL1 + parcial2 * PESO_PARCIAL2 + examen_final * PESO_EXAMEN_FINAL,
        2,
    )


class CalificacionService:
    def __init__(self, db: Session):
        self.repository = CalificacionRepository(db)

    def consultar(self) -> ResponseRest[CalificacionOut]:
        data = self.repository.find_all()
        return ResponseRest[CalificacionOut](data=data, info_list=[])

    def buscar_por_id(self, id_calificacion: int) -> ResponseRest[CalificacionOut]:
        info_list, data = [], []
        encontrada = self.repository.find_by_id(id_calificacion)
        if encontrada is not None:
            data.append(encontrada)
        else:
            info_list.append(InfoRest(codigo=1, mensaje="Calificacion no encontrada", estado=1))
        return ResponseRest[CalificacionOut](data=data, info_list=info_list)

    def crear(self, calificacion_in: CalificacionCreate) -> ResponseRest[CalificacionOut]:
        promedio = calcular_promedio(
            calificacion_in.parcial1, calificacion_in.parcial2, calificacion_in.examen_final
        )
        nueva = Calificacion(**calificacion_in.model_dump(), promedio=promedio)
        guardada = self.repository.save(nueva)
        return ResponseRest[CalificacionOut](data=[guardada], info_list=[])

    def modificar(self, id_calificacion: int, calificacion_in: CalificacionUpdate) -> ResponseRest[CalificacionOut]:
        info_list, data = [], []
        encontrada = self.repository.find_by_id(id_calificacion)
        if encontrada is not None:
            for campo, valor in calificacion_in.model_dump().items():
                setattr(encontrada, campo, valor)
            encontrada.promedio = calcular_promedio(
                encontrada.parcial1, encontrada.parcial2, encontrada.examen_final
            )
            data.append(self.repository.save(encontrada))
        else:
            info_list.append(InfoRest(codigo=1, mensaje="Calificacion no encontrada", estado=1))
        return ResponseRest[CalificacionOut](data=data, info_list=info_list)

    def eliminar(self, id_calificacion: int) -> ResponseRest[CalificacionOut]:
        info_list = []
        eliminada = self.repository.delete_by_id(id_calificacion)
        if not eliminada:
            info_list.append(InfoRest(codigo=1, mensaje="Calificacion no encontrada", estado=1))
        return ResponseRest[CalificacionOut](data=[], info_list=info_list)
