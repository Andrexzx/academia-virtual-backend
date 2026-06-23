"""Repositorio de Matricula (capa de acceso a datos, equivalente a JpaRepository)."""
from sqlalchemy.orm import Session
from app.models.matricula import Matricula


class MatriculaRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_all(self):
        return self.db.query(Matricula).all()

    def find_by_id(self, id_matricula: int):
        return self.db.query(Matricula).filter(Matricula.id_matricula == id_matricula).first()

    def save(self, matricula: Matricula) -> Matricula:
        self.db.add(matricula)
        self.db.commit()
        self.db.refresh(matricula)
        return matricula
