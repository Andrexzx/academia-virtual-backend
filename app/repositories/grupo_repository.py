"""Repositorio de Grupo (capa de acceso a datos, equivalente a JpaRepository)."""
from sqlalchemy.orm import Session
from app.models.grupo import Grupo


class GrupoRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_all(self):
        return self.db.query(Grupo).all()

    def find_by_id(self, id_grupo: int):
        return self.db.query(Grupo).filter(Grupo.id_grupo == id_grupo).first()

    def save(self, grupo: Grupo) -> Grupo:
        self.db.add(grupo)
        self.db.commit()
        self.db.refresh(grupo)
        return grupo

    def delete_by_id(self, id_grupo: int) -> bool:
        encontrado = self.find_by_id(id_grupo)
        if encontrado is None:
            return False
        self.db.delete(encontrado)
        self.db.commit()
        return True
