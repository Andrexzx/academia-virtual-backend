"""Esquemas Pydantic de Comprobante (entrada y salida de la API)."""
from datetime import date
from pydantic import BaseModel, ConfigDict


class ComprobanteCreate(BaseModel):
    """
    Solo se pide el subtotal y la matrícula asociada: el IVA y el total
    los calcula el servicio automáticamente (SRS 2.9 - Emisión de
    comprobantes de venta).
    """
    fecha: date
    subtotal: float
    id_matricula: int


class ComprobanteOut(BaseModel):
    id_comprobante: int
    fecha: date
    subtotal: float
    iva: float
    total: float
    id_matricula: int

    model_config = ConfigDict(from_attributes=True)
