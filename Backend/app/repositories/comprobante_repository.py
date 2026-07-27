"""Repositorio de Comprobante (capa de acceso a datos, equivalente a JpaRepository)."""
from sqlalchemy.orm import Session
from app.models.comprobante import Comprobante


class ComprobanteRepository:
    def __init__(self, db: Session):
        self.db = db

    def find_all(self):
        return self.db.query(Comprobante).all()

    def find_by_id(self, id_comprobante: int):
        return self.db.query(Comprobante).filter(
            Comprobante.id_comprobante == id_comprobante
        ).first()

    def save(self, comprobante: Comprobante) -> Comprobante:
        self.db.add(comprobante)
        self.db.commit()
        self.db.refresh(comprobante)
        return comprobante
