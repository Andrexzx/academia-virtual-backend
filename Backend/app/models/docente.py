"""Modelo ORM de Docente (equivalente a la clase @Entity en el ejemplo Spring)."""
from sqlalchemy import Column, Integer, String
from app.database import Base


class Docente(Base):
    __tablename__ = "docente"

    id_docente = Column(Integer, primary_key=True, index=True, autoincrement=True)
    titulo = Column(String, nullable=False)
    especialidad = Column(String, nullable=False)
    experiencia = Column(Integer, nullable=False)
