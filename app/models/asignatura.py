"""Modelo ORM de Asignatura (equivalente a la clase @Entity en el ejemplo Spring)."""
from sqlalchemy import Column, Integer, String
from app.database import Base


class Asignatura(Base):
    __tablename__ = "asignatura"

    codigo = Column(String, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    creditos = Column(Integer, nullable=False)
    nivel = Column(String, nullable=False)
