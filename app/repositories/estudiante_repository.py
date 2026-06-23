"""Repositorio de Estudiante (capa de acceso a datos, equivalente a JpaRepository)."""
from sqlalchemy.orm import Session
from app.models.estudiante import Estudiante


class EstudianteRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_all(self):
        return self.db.query(Estudiante).all()

    def find_by_id(self, id_estudiante: int):
        return self.db.query(Estudiante).filter(Estudiante.id_estudiante == id_estudiante).first()

    def save(self, estudiante: Estudiante) -> Estudiante:
        self.db.add(estudiante)
        self.db.commit()
        self.db.refresh(estudiante)
        return estudiante

    def delete_by_id(self, id_estudiante: int) -> bool:
        encontrado = self.find_by_id(id_estudiante)
        if encontrado is None:
            return False
        self.db.delete(encontrado)
        self.db.commit()
        return True
