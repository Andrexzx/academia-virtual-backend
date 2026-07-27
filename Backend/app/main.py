"""
Backend de Academia Virtual L.S. (Tarea 02.03)

Construido con FastAPI siguiendo el patrón modelo/repositorio/servicio/
controlador, basado en los requerimientos de la Tarea 02.01 (SRS) y el
diseño de la Tarea 02.02 (DDS).

Documentación interactiva (Swagger):
    http://localhost:8000/docs
Documentación alternativa (ReDoc):
    http://localhost:8000/redoc
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import asignatura, docente, estudiante, grupo, matricula, calificacion, comprobante  # noqa: F401
from app.routers import (
    asignatura_controller,
    docente_controller,
    estudiante_controller,
    grupo_controller,
    matricula_controller,
    calificacion_controller,
    comprobante_controller,
)

# Crea las tablas en la base de datos si todavía no existen.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Academia Virtual L.S. - API",
    description=(
        "Backend de gestión académica (matriculación, calificaciones, "
        "oferta de grupos y comprobantes) - Tarea 02.03, Grupo 01."
    ),
    version="1.0.0",
)

# Configurar middleware CORS para permitir peticiones del cliente Angular
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(asignatura_controller.router)
app.include_router(docente_controller.router)
app.include_router(estudiante_controller.router)
app.include_router(grupo_controller.router)
app.include_router(matricula_controller.router)
app.include_router(calificacion_controller.router)
app.include_router(comprobante_controller.router)


@app.get("/", tags=["Estado"])
def estado():
    return {"mensaje": "Academia Virtual L.S. - API en ejecución", "docs": "/docs"}
