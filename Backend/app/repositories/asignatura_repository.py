"""Repositorio de Asignatura (capa de acceso a datos, equivalente a JpaRepository)."""
from sqlalchemy.orm import Session
from app.models.asignatura import Asignatura


class AsignaturaRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_all(self):
        return self.db.query(Asignatura).all()

    def find_by_id(self, codigo: str):
        return self.db.query(Asignatura).filter(Asignatura.codigo == codigo).first()

    def save(self, asignatura: Asignatura) -> Asignatura:
        self.db.add(asignatura)
        self.db.commit()
        self.db.refresh(asignatura)
        return asignatura

    def delete_by_id(self, codigo: str) -> bool:
        encontrado = self.find_by_id(codigo)
        if encontrado is None:
            return False
        self.db.delete(encontrado)
        self.db.commit()
        return True
