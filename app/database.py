"""
Configuración de la base de datos.

Por defecto usa SQLite (academia_virtual.db) para que el proyecto
funcione sin instalar nada extra. Para usar PostgreSQL/MySQL en
producción solo hay que definir la variable de entorno DATABASE_URL,
por ejemplo:

    DATABASE_URL=postgresql://usuario:password@localhost:5432/academia_virtual
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./academia_virtual.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependencia de FastAPI: entrega una sesión de BD y la cierra al terminar."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
