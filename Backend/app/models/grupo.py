"""Modelo ORM de Grupo (equivalente a la clase @Entity en el ejemplo Spring)."""
from sqlalchemy import Column, ForeignKey, Integer, String
from app.database import Base


class Grupo(Base):
    __tablename__ = "grupo"

    id_grupo = Column(Integer, primary_key=True, index=True, autoincrement=True)
    modalidad = Column(String, nullable=False)
    horario = Column(String, nullable=False)
    cupo_maximo = Column(Integer, nullable=False)
    id_docente = Column(Integer, ForeignKey("docente.id_docente"), nullable=False)
    cod_asignatura = Column(String, ForeignKey("asignatura.codigo"), nullable=False)
