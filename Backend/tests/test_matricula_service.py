from mockito import mock, when, verify
from app.services.matricula_service import (
    MatriculaService,
    TransicionInvalidaError,
    ESTADO_PREINSCRITO,
    ESTADO_PENDIENTE_PAGO,
    ESTADO_MATRICULADO,
    ESTADO_ACTIVO,
    ESTADO_FINALIZADO,
    ESTADO_CANCELADO,
    ESTADO_ANULADO,
)
from app.repositories.matricula_repository import MatriculaRepository
from app.schemas.matricula_schema import MatriculaCreate
from app.models.matricula import Matricula
from datetime import date
import pytest

def test_consultar_matriculas():
    db_mock = mock()
    service = MatriculaService(db_mock)
    repo_mock = mock(MatriculaRepository)
    service.repository = repo_mock

    matriculas_mock = [
        Matricula(id_matricula=1, fecha=date(2026, 6, 22), estado=ESTADO_PREINSCRITO, id_estudiante=1, id_grupo=1)
    ]
    when(repo_mock).find_all().thenReturn(matriculas_mock)

    result = service.consultar()
    assert len(result.data) == 1
    assert result.data[0].estado == ESTADO_PREINSCRITO
    verify(repo_mock).find_all()

def test_buscar_por_id_encontrado():
    db_mock = mock()
    service = MatriculaService(db_mock)
    repo_mock = mock(MatriculaRepository)
    service.repository = repo_mock

    matricula_mock = Matricula(id_matricula=1, fecha=date(2026, 6, 22), estado=ESTADO_PREINSCRITO, id_estudiante=1, id_grupo=1)
    when(repo_mock).find_by_id(1).thenReturn(matricula_mock)

    result = service.buscar_por_id(1)
    assert len(result.data) == 1
    assert result.data[0].id_matricula == 1

def test_buscar_por_id_no_encontrado():
    db_mock = mock()
    service = MatriculaService(db_mock)
    repo_mock = mock(MatriculaRepository)
    service.repository = repo_mock

    when(repo_mock).find_by_id(99).thenReturn(None)

    result = service.buscar_por_id(99)
    assert len(result.data) == 0
    assert len(result.info_list) == 1

def test_crear_matricula():
    db_mock = mock()
    service = MatriculaService(db_mock)
    repo_mock = mock(MatriculaRepository)
    service.repository = repo_mock

    matricula_in = MatriculaCreate(
        fecha=date(2026, 6, 22),
        id_estudiante=1,
        id_grupo=1
    )

    def mock_save(matricula):
        matricula.id_matricula = 1
        return matricula

    when(repo_mock).save(...).thenAnswer(mock_save)

    result = service.crear(matricula_in)
    assert len(result.data) == 1
    assert result.data[0].id_matricula == 1
    assert result.data[0].estado == ESTADO_PREINSCRITO

def test_flujo_exitoso_matricula():
    db_mock = mock()
    service = MatriculaService(db_mock)
    repo_mock = mock(MatriculaRepository)
    service.repository = repo_mock

    matricula = Matricula(id_matricula=1, fecha=date(2026, 6, 22), estado=ESTADO_PREINSCRITO, id_estudiante=1, id_grupo=1)

    when(repo_mock).find_by_id(1).thenReturn(matricula)
    when(repo_mock).save(matricula).thenReturn(matricula)

    # 1. Validar requisitos (Aprobar) -> Pendiente pago
    res = service.validar_requisitos(1, aprobado=True)
    assert res.data[0].estado == ESTADO_PENDIENTE_PAGO

    # 2. Confirmar pago -> Matriculado
    res = service.confirmar_pago(1, pago_realizado=True)
    assert res.data[0].estado == ESTADO_MATRICULADO

    # 3. Activar -> Activo
    res = service.activar(1)
    assert res.data[0].estado == ESTADO_ACTIVO

    # 4. Finalizar -> Finalizado
    res = service.finalizar(1)
    assert res.data[0].estado == ESTADO_FINALIZADO

def test_matricula_rechazada_y_anulada():
    db_mock = mock()
    service = MatriculaService(db_mock)
    repo_mock = mock(MatriculaRepository)
    service.repository = repo_mock

    # Rechazo en validación
    matricula1 = Matricula(id_matricula=1, fecha=date(2026, 6, 22), estado=ESTADO_PREINSCRITO, id_estudiante=1, id_grupo=1)
    when(repo_mock).find_by_id(1).thenReturn(matricula1)
    when(repo_mock).save(matricula1).thenReturn(matricula1)

    res = service.validar_requisitos(1, aprobado=False)
    assert res.data[0].estado == ESTADO_CANCELADO

    # Rechazo en pago
    matricula2 = Matricula(id_matricula=2, fecha=date(2026, 6, 22), estado=ESTADO_PENDIENTE_PAGO, id_estudiante=1, id_grupo=1)
    when(repo_mock).find_by_id(2).thenReturn(matricula2)
    when(repo_mock).save(matricula2).thenReturn(matricula2)

    res = service.confirmar_pago(2, pago_realizado=False)
    assert res.data[0].estado == ESTADO_ANULADO

def test_transiciones_invalidas():
    db_mock = mock()
    service = MatriculaService(db_mock)
    repo_mock = mock(MatriculaRepository)
    service.repository = repo_mock

    # Intentar activar directamente desde Preinscrito
    matricula = Matricula(id_matricula=1, fecha=date(2026, 6, 22), estado=ESTADO_PREINSCRITO, id_estudiante=1, id_grupo=1)
    when(repo_mock).find_by_id(1).thenReturn(matricula)

    with pytest.raises(TransicionInvalidaError):
        service.activar(1)

    # Intentar finalizar desde Matriculado
    matricula.estado = ESTADO_MATRICULADO
    with pytest.raises(TransicionInvalidaError):
        service.finalizar(1)
        
    # Intentar cambiar de estado matrícula que no existe
    when(repo_mock).find_by_id(99).thenReturn(None)
    with pytest.raises(ValueError):
        service.activar(99)
