"""Servicio de Grupo (lógica de negocio, equivalente a CategoriaServiceImpl)."""
from sqlalchemy.orm import Session
from app.models.grupo import Grupo
from app.repositories.grupo_repository import GrupoRepository
from app.schemas.common import InfoRest, ResponseRest
from app.schemas.grupo_schema import GrupoOut, GrupoCreate, GrupoUpdate


class GrupoService:
    def __init__(self, db: Session):
        self.repository = GrupoRepository(db)

    def consultar(self) -> ResponseRest[GrupoOut]:
        data = self.repository.find_all()
        return ResponseRest[GrupoOut](data=data, info_list=[])

    def buscar_por_id(self, id_grupo: int) -> ResponseRest[GrupoOut]:
        info_list, data = [], []
        encontrado = self.repository.find_by_id(id_grupo)
        if encontrado is not None:
            data.append(encontrado)
        else:
            info_list.append(InfoRest(codigo=1, mensaje="Grupo no encontrado", estado=1))
        return ResponseRest[GrupoOut](data=data, info_list=info_list)

    def crear(self, grupo_in: GrupoCreate) -> ResponseRest[GrupoOut]:
        nuevo = Grupo(**grupo_in.model_dump())
        guardado = self.repository.save(nuevo)
        return ResponseRest[GrupoOut](data=[guardado], info_list=[])

    def modificar(self, id_grupo: int, grupo_in: GrupoUpdate) -> ResponseRest[GrupoOut]:
        info_list, data = [], []
        encontrado = self.repository.find_by_id(id_grupo)
        if encontrado is not None:
            for campo, valor in grupo_in.model_dump().items():
                setattr(encontrado, campo, valor)
            data.append(self.repository.save(encontrado))
        else:
            info_list.append(InfoRest(codigo=1, mensaje="Grupo no encontrado", estado=1))
        return ResponseRest[GrupoOut](data=data, info_list=info_list)

    def eliminar(self, id_grupo: int) -> ResponseRest[GrupoOut]:
        info_list = []
        eliminado = self.repository.delete_by_id(id_grupo)
        if not eliminado:
            info_list.append(InfoRest(codigo=1, mensaje="Grupo no encontrado", estado=1))
        return ResponseRest[GrupoOut](data=[], info_list=info_list)
