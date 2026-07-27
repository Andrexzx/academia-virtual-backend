"""
Servicio de Comprobante.

Implementa el requerimiento de la SRS 2.9 (Ingresos y Egresos /
Emisión de comprobantes de venta): al confirmar un pago, el sistema
genera el comprobante calculando automáticamente el IVA y el total.
"""
from sqlalchemy.orm import Session
from app.models.comprobante import Comprobante
from app.repositories.comprobante_repository import ComprobanteRepository
from app.schemas.common import InfoRest, ResponseRest
from app.schemas.comprobante_schema import ComprobanteOut, ComprobanteCreate

PORCENTAJE_IVA = 0.15  # ajustar según la tasa vigente (parámetro general de la SRS 2.1.3)


def calcular_iva_y_total(subtotal: float) -> tuple[float, float]:
    """
    Calcula el IVA (15%) y el total a partir del subtotal.

    >>> calcular_iva_y_total(100.0)
    (15.0, 115.0)
    >>> calcular_iva_y_total(10.0)
    (1.5, 11.5)
    >>> calcular_iva_y_total(50.0)
    (7.5, 57.5)
    """
    iva = round(subtotal * PORCENTAJE_IVA, 2)
    total = round(subtotal + iva, 2)
    return iva, total


class ComprobanteService:
    def __init__(self, db: Session):
        self.repository = ComprobanteRepository(db)

    def consultar(self) -> ResponseRest[ComprobanteOut]:
        data = self.repository.find_all()
        return ResponseRest[ComprobanteOut](data=data, info_list=[])

    def buscar_por_id(self, id_comprobante: int) -> ResponseRest[ComprobanteOut]:
        info_list, data = [], []
        encontrado = self.repository.find_by_id(id_comprobante)
        if encontrado is not None:
            data.append(encontrado)
        else:
            info_list.append(InfoRest(codigo=1, mensaje="Comprobante no encontrado", estado=1))
        return ResponseRest[ComprobanteOut](data=data, info_list=info_list)

    def crear(self, comprobante_in: ComprobanteCreate) -> ResponseRest[ComprobanteOut]:
        iva, total = calcular_iva_y_total(comprobante_in.subtotal)
        nuevo = Comprobante(
            fecha=comprobante_in.fecha,
            subtotal=comprobante_in.subtotal,
            id_matricula=comprobante_in.id_matricula,
            iva=iva,
            total=total,
        )
        guardado = self.repository.save(nuevo)
        return ResponseRest[ComprobanteOut](data=[guardado], info_list=[])
