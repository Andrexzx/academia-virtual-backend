"""Servicio de Docente (lógica de negocio, equivalente a CategoriaServiceImpl)."""
from sqlalchemy.orm import Session
from app.models.docente import Docente
from app.repositories.docente_repository import DocenteRepository
from app.schemas.common import InfoRest, ResponseRest
from app.schemas.docente_schema import DocenteOut, DocenteCreate, DocenteUpdate


class DocenteService:
    def __init__(self, db: Session):
        self.repository = DocenteRepository(db)

    def consultar(self) -> ResponseRest[DocenteOut]:
        data = self.repository.find_all()
        return ResponseRest[DocenteOut](data=data, info_list=[])

    def buscar_por_id(self, id_docente: int) -> ResponseRest[DocenteOut]:
        info_list, data = [], []
        encontrado = self.repository.find_by_id(id_docente)
        if encontrado is not None:
            data.append(encontrado)
        else:
            info_list.append(InfoRest(codigo=1, mensaje="Docente no encontrado", estado=1))
        return ResponseRest[DocenteOut](data=data, info_list=info_list)

    def crear(self, docente_in: DocenteCreate) -> ResponseRest[DocenteOut]:
        nuevo = Docente(**docente_in.model_dump())
        guardado = self.repository.save(nuevo)
        return ResponseRest[DocenteOut](data=[guardado], info_list=[])

    def modificar(self, id_docente: int, docente_in: DocenteUpdate) -> ResponseRest[DocenteOut]:
        info_list, data = [], []
        encontrado = self.repository.find_by_id(id_docente)
        if encontrado is not None:
            for campo, valor in docente_in.model_dump().items():
                setattr(encontrado, campo, valor)
            data.append(self.repository.save(encontrado))
        else:
            info_list.append(InfoRest(codigo=1, mensaje="Docente no encontrado", estado=1))
        return ResponseRest[DocenteOut](data=data, info_list=info_list)

    def eliminar(self, id_docente: int) -> ResponseRest[DocenteOut]:
        info_list = []
        eliminado = self.repository.delete_by_id(id_docente)
        if not eliminado:
            info_list.append(InfoRest(codigo=1, mensaje="Docente no encontrado", estado=1))
        return ResponseRest[DocenteOut](data=[], info_list=info_list)
