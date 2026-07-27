"""Repositorio de Calificacion (capa de acceso a datos, equivalente a JpaRepository)."""
from sqlalchemy.orm import Session
from app.models.calificacion import Calificacion


class CalificacionRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_all(self):
        return self.db.query(Calificacion).all()

    def find_by_id(self, id_calificacion: int):
        return self.db.query(Calificacion).filter(
            Calificacion.id_calificacion == id_calificacion
        ).first()

    def save(self, calificacion: Calificacion) -> Calificacion:
        self.db.add(calificacion)
        self.db.commit()
        self.db.refresh(calificacion)
        return calificacion

    def delete_by_id(self, id_calificacion: int) -> bool:
        encontrada = self.find_by_id(id_calificacion)
        if encontrada is None:
            return False
        self.db.delete(encontrada)
        self.db.commit()
        return True
