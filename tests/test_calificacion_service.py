from mockito import mock, when, verify
from app.services.calificacion_service import CalificacionService
from app.repositories.calificacion_repository import CalificacionRepository
from app.schemas.calificacion_schema import CalificacionCreate, CalificacionUpdate
from app.models.calificacion import Calificacion
import pytest

def test_consultar_calificaciones():
    db_mock = mock()
    service = CalificacionService(db_mock)
    repo_mock = mock(CalificacionRepository)
    service.repository = repo_mock

    calificaciones_mock = [
        Calificacion(id_calificacion=1, parcial1=8.0, parcial2=9.0, examen_final=7.0, promedio=7.9, id_estudiante=1, cod_asignatura="SIS101"),
        Calificacion(id_calificacion=2, parcial1=6.0, parcial2=6.0, examen_final=5.0, promedio=5.6, id_estudiante=2, cod_asignatura="SIS101")
    ]
    
    when(repo_mock).find_all().thenReturn(calificaciones_mock)

    result = service.consultar()
    assert len(result.data) == 2
    assert result.data[0].id_calificacion == 1
    assert result.data[0].promedio == 7.9
    verify(repo_mock).find_all()

def test_buscar_por_id_encontrado():
    db_mock = mock()
    service = CalificacionService(db_mock)
    repo_mock = mock(CalificacionRepository)
    service.repository = repo_mock

    calificacion_mock = Calificacion(id_calificacion=1, parcial1=8.0, parcial2=9.0, examen_final=7.0, promedio=7.9, id_estudiante=1, cod_asignatura="SIS101")
    when(repo_mock).find_by_id(1).thenReturn(calificacion_mock)

    result = service.buscar_por_id(1)
    assert len(result.data) == 1
    assert result.data[0].id_calificacion == 1
    assert len(result.info_list) == 0

def test_buscar_por_id_no_encontrado():
    db_mock = mock()
    service = CalificacionService(db_mock)
    repo_mock = mock(CalificacionRepository)
    service.repository = repo_mock

    when(repo_mock).find_by_id(99).thenReturn(None)

    result = service.buscar_por_id(99)
    assert len(result.data) == 0
    assert len(result.info_list) == 1
    assert result.info_list[0].mensaje == "Calificacion no encontrada"

def test_crear_calificacion():
    db_mock = mock()
    service = CalificacionService(db_mock)
    repo_mock = mock(CalificacionRepository)
    service.repository = repo_mock

    calificacion_in = CalificacionCreate(
        parcial1=8.0,
        parcial2=7.0,
        examen_final=9.0,
        id_estudiante=1,
        cod_asignatura="SIS101"
    )
    
    # 8*0.3 + 7*0.3 + 9*0.4 = 2.4 + 2.1 + 3.6 = 8.1
    def mock_save(calificacion):
        calificacion.id_calificacion = 123
        return calificacion
        
    when(repo_mock).save(...).thenAnswer(mock_save)

    result = service.crear(calificacion_in)
    assert len(result.data) == 1
    assert result.data[0].id_calificacion == 123
    assert result.data[0].promedio == 8.1

def test_modificar_calificacion_encontrada():
    db_mock = mock()
    service = CalificacionService(db_mock)
    repo_mock = mock(CalificacionRepository)
    service.repository = repo_mock

    calificacion_existente = Calificacion(
        id_calificacion=1,
        parcial1=5.0,
        parcial2=5.0,
        examen_final=5.0,
        promedio=5.0,
        id_estudiante=1,
        cod_asignatura="SIS101"
    )
    
    calificacion_in = CalificacionUpdate(
        parcial1=8.0,
        parcial2=8.0,
        examen_final=8.0,
        id_estudiante=1,
        cod_asignatura="SIS101"
    )

    when(repo_mock).find_by_id(1).thenReturn(calificacion_existente)
    when(repo_mock).save(calificacion_existente).thenReturn(calificacion_existente)

    result = service.modificar(1, calificacion_in)
    assert len(result.data) == 1
    assert result.data[0].promedio == 8.0
    assert calificacion_existente.parcial1 == 8.0

def test_modificar_calificacion_no_encontrada():
    db_mock = mock()
    service = CalificacionService(db_mock)
    repo_mock = mock(CalificacionRepository)
    service.repository = repo_mock

    calificacion_in = CalificacionUpdate(
        parcial1=8.0,
        parcial2=8.0,
        examen_final=8.0,
        id_estudiante=1,
        cod_asignatura="SIS101"
    )

    when(repo_mock).find_by_id(99).thenReturn(None)

    result = service.modificar(99, calificacion_in)
    assert len(result.data) == 0
    assert len(result.info_list) == 1
    assert result.info_list[0].mensaje == "Calificacion no encontrada"

def test_eliminar_calificacion_encontrada():
    db_mock = mock()
    service = CalificacionService(db_mock)
    repo_mock = mock(CalificacionRepository)
    service.repository = repo_mock

    when(repo_mock).delete_by_id(1).thenReturn(True)

    result = service.eliminar(1)
    assert len(result.info_list) == 0
    verify(repo_mock).delete_by_id(1)

def test_eliminar_calificacion_no_encontrada():
    db_mock = mock()
    service = CalificacionService(db_mock)
    repo_mock = mock(CalificacionRepository)
    service.repository = repo_mock

    when(repo_mock).delete_by_id(99).thenReturn(False)

    result = service.eliminar(99)
    assert len(result.info_list) == 1
    assert result.info_list[0].mensaje == "Calificacion no encontrada"
