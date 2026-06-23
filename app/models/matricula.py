"""Modelo ORM de Matricula (equivalente a la clase @Entity en el ejemplo Spring)."""
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database import Base


class Matricula(Base):
    __tablename__ = "matricula"

    id_matricula = Column(Integer, primary_key=True, index=True, autoincrement=True)
    fecha = Column(Date, nullable=False)
    estado = Column(String, nullable=False, default="Preinscrito")
    id_estudiante = Column(Integer, ForeignKey("estudiante.id_estudiante"), nullable=False)
    id_grupo = Column(Integer, ForeignKey("grupo.id_grupo"), nullable=False)
