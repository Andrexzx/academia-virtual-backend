"""Servicio de Asignatura (lógica de negocio, equivalente a CategoriaServiceImpl)."""
from sqlalchemy.orm import Session
from app.models.asignatura import Asignatura
from app.repositories.asignatura_repository import AsignaturaRepository
from app.schemas.common import InfoRest, ResponseRest
from app.schemas.asignatura_schema import AsignaturaOut, AsignaturaCreate, AsignaturaUpdate


class AsignaturaService:
    def __init__(self, db: Session):
        self.repository = AsignaturaRepository(db)

    def consultar(self) -> ResponseRest[AsignaturaOut]:
        data = self.repository.find_all()
        return ResponseRest[AsignaturaOut](data=data, info_list=[])

    def buscar_por_id(self, codigo: str) -> ResponseRest[AsignaturaOut]:
        info_list, data = [], []
        encontrado = self.repository.find_by_id(codigo)
        if encontrado is not None:
            data.append(encontrado)
        else:
            info_list.append(InfoRest(codigo=1, mensaje="Asignatura no encontrado", estado=1))
        return ResponseRest[AsignaturaOut](data=data, info_list=info_list)

    def crear(self, asignatura_in: AsignaturaCreate) -> ResponseRest[AsignaturaOut]:
        nuevo = Asignatura(**asignatura_in.model_dump())
        guardado = self.repository.save(nuevo)
        return ResponseRest[AsignaturaOut](data=[guardado], info_list=[])

    def modificar(self, codigo: str, asignatura_in: AsignaturaUpdate) -> ResponseRest[AsignaturaOut]:
        info_list, data = [], []
        encontrado = self.repository.find_by_id(codigo)
        if encontrado is not None:
            for campo, valor in asignatura_in.model_dump().items():
                setattr(encontrado, campo, valor)
            data.append(self.repository.save(encontrado))
        else:
            info_list.append(InfoRest(codigo=1, mensaje="Asignatura no encontrado", estado=1))
        return ResponseRest[AsignaturaOut](data=data, info_list=info_list)

    def eliminar(self, codigo: str) -> ResponseRest[AsignaturaOut]:
        info_list = []
        eliminado = self.repository.delete_by_id(codigo)
        if not eliminado:
            info_list.append(InfoRest(codigo=1, mensaje="Asignatura no encontrado", estado=1))
        return ResponseRest[AsignaturaOut](data=[], info_list=info_list)
