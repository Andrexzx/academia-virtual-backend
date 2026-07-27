"""Modelo ORM de Estudiante (equivalente a la clase @Entity en el ejemplo Spring)."""
from sqlalchemy import Column, Integer, String
from app.database import Base


class Estudiante(Base):
    __tablename__ = "estudiante"

    id_estudiante = Column(Integer, primary_key=True, index=True, autoincrement=True)
    cedula = Column(String, nullable=False)
    nombre = Column(String, nullable=False)
    direccion = Column(String, nullable=False)
    telefono = Column(String, nullable=False)
