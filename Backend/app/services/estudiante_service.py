"""Servicio de Estudiante (lógica de negocio, equivalente a CategoriaServiceImpl)."""
from sqlalchemy.orm import Session
from app.models.estudiante import Estudiante
from app.repositories.estudiante_repository import EstudianteRepository
from app.schemas.common import InfoRest, ResponseRest
from app.schemas.estudiante_schema import EstudianteOut, EstudianteCreate, EstudianteUpdate


class EstudianteService:
    def __init__(self, db: Session):
        self.repository = EstudianteRepository(db)

    def consultar(self) -> ResponseRest[EstudianteOut]:
        data = self.repository.find_all()
        return ResponseRest[EstudianteOut](data=data, info_list=[])

    def buscar_por_id(self, id_estudiante: int) -> ResponseRest[EstudianteOut]:
        info_list, data = [], []
        encontrado = self.repository.find_by_id(id_estudiante)
        if encontrado is not None:
            data.append(encontrado)
        else:
            info_list.append(InfoRest(codigo=1, mensaje="Estudiante no encontrado", estado=1))
        return ResponseRest[EstudianteOut](data=data, info_list=info_list)

    def crear(self, estudiante_in: EstudianteCreate) -> ResponseRest[EstudianteOut]:
        nuevo = Estudiante(**estudiante_in.model_dump())
        guardado = self.repository.save(nuevo)
        return ResponseRest[EstudianteOut](data=[guardado], info_list=[])

    def modificar(self, id_estudiante: int, estudiante_in: EstudianteUpdate) -> ResponseRest[EstudianteOut]:
        info_list, data = [], []
        encontrado = self.repository.find_by_id(id_estudiante)
        if encontrado is not None:
            for campo, valor in estudiante_in.model_dump().items():
                setattr(encontrado, campo, valor)
            data.append(self.repository.save(encontrado))
        else:
            info_list.append(InfoRest(codigo=1, mensaje="Estudiante no encontrado", estado=1))
        return ResponseRest[EstudianteOut](data=data, info_list=info_list)

    def eliminar(self, id_estudiante: int) -> ResponseRest[EstudianteOut]:
        info_list = []
        eliminado = self.repository.delete_by_id(id_estudiante)
        if not eliminado:
            info_list.append(InfoRest(codigo=1, mensaje="Estudiante no encontrado", estado=1))
        return ResponseRest[EstudianteOut](data=[], info_list=info_list)
