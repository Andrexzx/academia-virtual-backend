"""
Servicio de Matricula.

Implementa la máquina de estados definida en el diagrama de estados
de la DDS (Tarea 02.02, punto 7.3.4):

    Preinscrito -> (Validación Académica)
        -> Aprobado     -> Pendiente pago
        -> Rechazado    -> Cancelado
    Pendiente pago -> (pago)
        -> Pago realizado -> Matriculado
        -> No paga        -> Anulado
    Matriculado -> Activo -> (Periodo cierra) -> Finalizado

Y los pasos del diagrama de secuencia (DDS 7.3.3):
    1. Solicita matrícula      -> crear()
    6-7. Validar requisitos    -> validar_requisitos()
    8-9. Generar / confirmar pago -> confirmar_pago()
"""
from sqlalchemy.orm import Session
from app.models.matricula import Matricula
from app.repositories.matricula_repository import MatriculaRepository
from app.schemas.common import InfoRest, ResponseRest
from app.schemas.matricula_schema import MatriculaOut, MatriculaCreate

ESTADO_PREINSCRITO = "Preinscrito"
ESTADO_PENDIENTE_PAGO = "Pendiente pago"
ESTADO_MATRICULADO = "Matriculado"
ESTADO_ACTIVO = "Activo"
ESTADO_FINALIZADO = "Finalizado"
ESTADO_CANCELADO = "Cancelado"
ESTADO_ANULADO = "Anulado"


class TransicionInvalidaError(Exception):
    """Se lanza cuando se intenta una transición de estado que no está permitida."""


class MatriculaService:
    def __init__(self, db: Session):
        self.repository = MatriculaRepository(db)

    def consultar(self) -> ResponseRest[MatriculaOut]:
        data = self.repository.find_all()
        return ResponseRest[MatriculaOut](data=data, info_list=[])

    def buscar_por_id(self, id_matricula: int) -> ResponseRest[MatriculaOut]:
        info_list, data = [], []
        encontrada = self.repository.find_by_id(id_matricula)
        if encontrada is not None:
            data.append(encontrada)
        else:
            info_list.append(InfoRest(codigo=1, mensaje="Matricula no encontrada", estado=1))
        return ResponseRest[MatriculaOut](data=data, info_list=info_list)

    def crear(self, matricula_in: MatriculaCreate) -> ResponseRest[MatriculaOut]:
        """Paso 1 de la secuencia: el estudiante solicita la matrícula -> queda 'Preinscrito'."""
        nueva = Matricula(**matricula_in.model_dump(), estado=ESTADO_PREINSCRITO)
        guardada = self.repository.save(nueva)
        return ResponseRest[MatriculaOut](data=[guardada], info_list=[])

    def _cambiar_estado(self, id_matricula: int, estado_requerido: str, estado_nuevo: str) -> Matricula:
        matricula = self.repository.find_by_id(id_matricula)
        if matricula is None:
            raise ValueError("Matricula no encontrada")
        if matricula.estado != estado_requerido:
            raise TransicionInvalidaError(
                f"No se puede pasar de '{matricula.estado}' a '{estado_nuevo}' "
                f"(se requiere estar en '{estado_requerido}')"
            )
        matricula.estado = estado_nuevo
        return self.repository.save(matricula)

    def validar_requisitos(self, id_matricula: int, aprobado: bool) -> ResponseRest[MatriculaOut]:
        """Validación Académica del diagrama de estados: Aprobado / Rechazado."""
        estado_nuevo = ESTADO_PENDIENTE_PAGO if aprobado else ESTADO_CANCELADO
        matricula = self._cambiar_estado(id_matricula, ESTADO_PREINSCRITO, estado_nuevo)
        return ResponseRest[MatriculaOut](data=[matricula], info_list=[])

    def confirmar_pago(self, id_matricula: int, pago_realizado: bool) -> ResponseRest[MatriculaOut]:
        """Pendiente pago -> Matriculado (pago realizado) / Anulado (no paga)."""
        estado_nuevo = ESTADO_MATRICULADO if pago_realizado else ESTADO_ANULADO
        matricula = self._cambiar_estado(id_matricula, ESTADO_PENDIENTE_PAGO, estado_nuevo)
        return ResponseRest[MatriculaOut](data=[matricula], info_list=[])

    def activar(self, id_matricula: int) -> ResponseRest[MatriculaOut]:
        """Matriculado -> Activo (inicio efectivo del período de clases)."""
        matricula = self._cambiar_estado(id_matricula, ESTADO_MATRICULADO, ESTADO_ACTIVO)
        return ResponseRest[MatriculaOut](data=[matricula], info_list=[])

    def finalizar(self, id_matricula: int) -> ResponseRest[MatriculaOut]:
        """Activo -> Finalizado (cierre del período lectivo)."""
        matricula = self._cambiar_estado(id_matricula, ESTADO_ACTIVO, ESTADO_FINALIZADO)
        return ResponseRest[MatriculaOut](data=[matricula], info_list=[])
