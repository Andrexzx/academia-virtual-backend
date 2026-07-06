from mockito import mock, when, verify
from app.services.comprobante_service import ComprobanteService
from app.repositories.comprobante_repository import ComprobanteRepository
from app.schemas.comprobante_schema import ComprobanteCreate
from app.models.comprobante import Comprobante
from datetime import date
import pytest

def test_consultar_comprobantes():
    db_mock = mock()
    service = ComprobanteService(db_mock)
    repo_mock = mock(ComprobanteRepository)
    service.repository = repo_mock

    comprobantes_mock = [
        Comprobante(id_comprobante=1, fecha=date(2026, 6, 22), subtotal=100.0, iva=15.0, total=115.0, id_matricula=1),
        Comprobante(id_comprobante=2, fecha=date(2026, 6, 23), subtotal=200.0, iva=30.0, total=230.0, id_matricula=2)
    ]
    when(repo_mock).find_all().thenReturn(comprobantes_mock)

    result = service.consultar()
    assert len(result.data) == 2
    assert result.data[0].id_comprobante == 1
    assert result.data[0].total == 115.0
    verify(repo_mock).find_all()

def test_buscar_por_id_encontrado():
    db_mock = mock()
    service = ComprobanteService(db_mock)
    repo_mock = mock(ComprobanteRepository)
    service.repository = repo_mock

    comprobante_mock = Comprobante(id_comprobante=1, fecha=date(2026, 6, 22), subtotal=100.0, iva=15.0, total=115.0, id_matricula=1)
    when(repo_mock).find_by_id(1).thenReturn(comprobante_mock)

    result = service.buscar_por_id(1)
    assert len(result.data) == 1
    assert result.data[0].id_comprobante == 1
    assert len(result.info_list) == 0

def test_buscar_por_id_no_encontrado():
    db_mock = mock()
    service = ComprobanteService(db_mock)
    repo_mock = mock(ComprobanteRepository)
    service.repository = repo_mock

    when(repo_mock).find_by_id(99).thenReturn(None)

    result = service.buscar_por_id(99)
    assert len(result.data) == 0
    assert len(result.info_list) == 1
    assert result.info_list[0].mensaje == "Comprobante no encontrado"

def test_crear_comprobante():
    db_mock = mock()
    service = ComprobanteService(db_mock)
    repo_mock = mock(ComprobanteRepository)
    service.repository = repo_mock

    comprobante_in = ComprobanteCreate(
        fecha=date(2026, 6, 22),
        subtotal=100.0,
        id_matricula=1
    )

    def mock_save(comprobante):
        comprobante.id_comprobante = 10
        return comprobante

    when(repo_mock).save(...).thenAnswer(mock_save)

    result = service.crear(comprobante_in)
    assert len(result.data) == 1
    assert result.data[0].id_comprobante == 10
    assert result.data[0].iva == 15.0
    assert result.data[0].total == 115.0
