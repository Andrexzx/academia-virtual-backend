"""Modelo ORM de Calificacion (equivalente a la clase @Entity en el ejemplo Spring)."""
from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.database import Base


class Calificacion(Base):
    __tablename__ = "calificacion"

    id_calificacion = Column(Integer, primary_key=True, index=True, autoincrement=True)
    parcial1 = Column(Float, nullable=False)
    parcial2 = Column(Float, nullable=False)
    examen_final = Column(Float, nullable=False)
    promedio = Column(Float, nullable=True)  # se calcula automáticamente en el servicio
    id_estudiante = Column(Integer, ForeignKey("estudiante.id_estudiante"), nullable=False)
    cod_asignatura = Column(String, ForeignKey("asignatura.codigo"), nullable=False)
