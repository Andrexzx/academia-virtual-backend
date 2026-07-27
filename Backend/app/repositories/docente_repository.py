"""Repositorio de Docente (capa de acceso a datos, equivalente a JpaRepository)."""
from sqlalchemy.orm import Session
from app.models.docente import Docente


class DocenteRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_all(self):
        return self.db.query(Docente).all()

    def find_by_id(self, id_docente: int):
        return self.db.query(Docente).filter(Docente.id_docente == id_docente).first()

    def save(self, docente: Docente) -> Docente:
        self.db.add(docente)
        self.db.commit()
        self.db.refresh(docente)
        return docente

    def delete_by_id(self, id_docente: int) -> bool:
        encontrado = self.find_by_id(id_docente)
        if encontrado is None:
            return False
        self.db.delete(encontrado)
        self.db.commit()
        return True
