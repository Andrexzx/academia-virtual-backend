from mockito import mock, when, verify
from app.services.estudiante_service import EstudianteService
from app.repositories.estudiante_repository import EstudianteRepository
from app.models.estudiante import Estudiante
from app.schemas.estudiante_schema import EstudianteCreate, EstudianteUpdate

from app.services.docente_service import DocenteService
from app.repositories.docente_repository import DocenteRepository
from app.models.docente import Docente
from app.schemas.docente_schema import DocenteCreate, DocenteUpdate

from app.services.asignatura_service import AsignaturaService
from app.repositories.asignatura_repository import AsignaturaRepository
from app.models.asignatura import Asignatura
from app.schemas.asignatura_schema import AsignaturaCreate, AsignaturaUpdate

from app.services.grupo_service import GrupoService
from app.repositories.grupo_repository import GrupoRepository
from app.models.grupo import Grupo
from app.schemas.grupo_schema import GrupoCreate, GrupoUpdate

def test_estudiante_service_crud():
    db_mock = mock()
    service = EstudianteService(db_mock)
    repo_mock = mock(EstudianteRepository)
    service.repository = repo_mock

    est = Estudiante(id_estudiante=1, cedula="1710000000", nombre="Daniel", direccion="Quito", telefono="0999")
    when(repo_mock).find_all().thenReturn([est])
    when(repo_mock).find_by_id(1).thenReturn(est)
    when(repo_mock).find_by_id(99).thenReturn(None)
    when(repo_mock).save(...).thenReturn(est)
    when(repo_mock).delete_by_id(1).thenReturn(True)
    when(repo_mock).delete_by_id(99).thenReturn(False)

    assert len(service.consultar().data) == 1
    assert len(service.buscar_por_id(1).data) == 1
    assert len(service.buscar_por_id(99).info_list) == 1
    
    est_create = EstudianteCreate(cedula="1710000000", nombre="Daniel", direccion="Quito", telefono="0999")
    assert len(service.crear(est_create).data) == 1
    
    est_update = EstudianteUpdate(cedula="1710000000", nombre="Daniel Modificado", direccion="Quito", telefono="0999")
    assert len(service.modificar(1, est_update).data) == 1
    assert len(service.modificar(99, est_update).info_list) == 1
    
    assert len(service.eliminar(1).info_list) == 0
    assert len(service.eliminar(99).info_list) == 1

def test_docente_service_crud():
    db_mock = mock()
    service = DocenteService(db_mock)
    repo_mock = mock(DocenteRepository)
    service.repository = repo_mock

    doc = Docente(id_docente=1, titulo="MSc", especialidad="Software", experiencia=5)
    when(repo_mock).find_all().thenReturn([doc])
    when(repo_mock).find_by_id(1).thenReturn(doc)
    when(repo_mock).find_by_id(99).thenReturn(None)
    when(repo_mock).save(...).thenReturn(doc)
    when(repo_mock).delete_by_id(1).thenReturn(True)
    when(repo_mock).delete_by_id(99).thenReturn(False)

    assert len(service.consultar().data) == 1
    assert len(service.buscar_por_id(1).data) == 1
    assert len(service.buscar_por_id(99).info_list) == 1
    
    doc_create = DocenteCreate(titulo="MSc", especialidad="Software", experiencia=5)
    assert len(service.crear(doc_create).data) == 1
    
    doc_update = DocenteUpdate(titulo="Dr", especialidad="Software", experiencia=6)
    assert len(service.modificar(1, doc_update).data) == 1
    assert len(service.modificar(99, doc_update).info_list) == 1
    
    assert len(service.eliminar(1).info_list) == 0
    assert len(service.eliminar(99).info_list) == 1

def test_asignatura_service_crud():
    db_mock = mock()
    service = AsignaturaService(db_mock)
    repo_mock = mock(AsignaturaRepository)
    service.repository = repo_mock

    asig = Asignatura(codigo="SIS101", nombre="Prog I", creditos=4, nivel="1")
    when(repo_mock).find_all().thenReturn([asig])
    when(repo_mock).find_by_id("SIS101").thenReturn(asig)
    when(repo_mock).find_by_id("99").thenReturn(None)
    when(repo_mock).save(...).thenReturn(asig)
    when(repo_mock).delete_by_id("SIS101").thenReturn(True)
    when(repo_mock).delete_by_id("99").thenReturn(False)

    assert len(service.consultar().data) == 1
    assert len(service.buscar_por_id("SIS101").data) == 1
    assert len(service.buscar_por_id("99").info_list) == 1
    
    asig_create = AsignaturaCreate(codigo="SIS101", nombre="Prog I", creditos=4, nivel="1")
    assert len(service.crear(asig_create).data) == 1
    
    asig_update = AsignaturaUpdate(codigo="SIS101", nombre="Prog II", creditos=5, nivel="2")
    assert len(service.modificar("SIS101", asig_update).data) == 1
    assert len(service.modificar("99", asig_update).info_list) == 1
    
    assert len(service.eliminar("SIS101").info_list) == 0
    assert len(service.eliminar("99").info_list) == 1

def test_grupo_service_crud():
    db_mock = mock()
    service = GrupoService(db_mock)
    repo_mock = mock(GrupoRepository)
    service.repository = repo_mock

    grp = Grupo(id_grupo=1, modalidad="Presencial", horario="Mañana", cupo_maximo=30, id_docente=1, cod_asignatura="SIS101")
    when(repo_mock).find_all().thenReturn([grp])
    when(repo_mock).find_by_id(1).thenReturn(grp)
    when(repo_mock).find_by_id(99).thenReturn(None)
    when(repo_mock).save(...).thenReturn(grp)
    when(repo_mock).delete_by_id(1).thenReturn(True)
    when(repo_mock).delete_by_id(99).thenReturn(False)

    assert len(service.consultar().data) == 1
    assert len(service.buscar_por_id(1).data) == 1
    assert len(service.buscar_por_id(99).info_list) == 1
    
    grp_create = GrupoCreate(modalidad="Presencial", horario="Mañana", cupo_maximo=30, id_docente=1, cod_asignatura="SIS101")
    assert len(service.crear(grp_create).data) == 1
    
    grp_update = GrupoUpdate(modalidad="Online", horario="Tarde", cupo_maximo=25, id_docente=1, cod_asignatura="SIS101")
    assert len(service.modificar(1, grp_update).data) == 1
    assert len(service.modificar(99, grp_update).info_list) == 1
    
    assert len(service.eliminar(1).info_list) == 0
    assert len(service.eliminar(99).info_list) == 1
