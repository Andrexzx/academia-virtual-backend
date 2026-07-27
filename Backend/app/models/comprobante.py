"""Modelo ORM de Comprobante (equivalente a la clase @Entity en el ejemplo Spring)."""
from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from app.database import Base


class Comprobante(Base):
    __tablename__ = "comprobante"

    id_comprobante = Column(Integer, primary_key=True, index=True, autoincrement=True)
    fecha = Column(Date, nullable=False)
    subtotal = Column(Float, nullable=False)
    iva = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    id_matricula = Column(Integer, ForeignKey("matricula.id_matricula"), nullable=False)
