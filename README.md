# Academia Virtual L.S. — Backend (Tarea 02.03)

Backend de gestión académica desarrollado con **FastAPI**, implementando los
requerimientos de la **Tarea 02.01 (SRS)** y el diseño de la **Tarea 02.02
(DDS)** del proyecto Academia Virtual L.S.

## Arquitectura

Se sigue el patrón **modelo / repositorio / servicio / controlador**, igual
al definido en la Figura 1 de la Tarea 02.03 (y al ejemplo en Spring Boot
proporcionado por el profesor), adaptado a FastAPI:

| Capa Spring Boot (ejemplo)        | Equivalente en este proyecto (FastAPI)      |
|------------------------------------|----------------------------------------------|
| `model` (`@Entity`)                | `app/models/*.py` (SQLAlchemy ORM)            |
| `model.repository` (`JpaRepository`) | `app/repositories/*_repository.py`         |
| `service` / `serviceImpl`          | `app/services/*_service.py`                   |
| `controller` (`@RestController`)   | `app/routers/*_controller.py`                 |
| `controller.response` (`ResponseRest`, `InfoRest`) | `app/schemas/common.py`     |

```
app/
├── main.py                 # arranque de la app + registro de routers + Swagger
├── database.py             # conexión SQLAlchemy (SQLite por defecto)
├── models/                 # entidades ORM: una por tabla del diagrama ER
├── schemas/                # esquemas Pydantic (entrada/salida + ResponseRest)
├── repositories/           # acceso a datos
├── services/               # lógica de negocio
└── routers/                # endpoints REST
```

## Entidades (según el diagrama ER de la Tarea 02.02)

`Estudiante`, `Docente`, `Asignatura`, `Grupo`, `Matricula`, `Calificacion`,
`Comprobante`.

## Lógica de negocio destacada

- **Matrícula**: máquina de estados según el diagrama de estados (7.3.4):
  `Preinscrito → Pendiente pago → Matriculado → Activo → Finalizado`
  (con ramas a `Cancelado` / `Anulado`). Cada transición es un endpoint
  propio (`/validar`, `/pago`, `/activar`, `/finalizar`) y se rechaza si la
  matrícula no está en el estado previo correcto.
- **Calificación**: el promedio final se calcula automáticamente
  (parcial1 30% + parcial2 30% + examen final 40%), según SRS 2.6.1.
- **Comprobante**: el IVA y el total se calculan automáticamente a partir
  del subtotal, según SRS 2.9.

## Cómo ejecutar el proyecto

```bash
# 1. Crear entorno virtual (recomendado)
python3 -m venv venv
source venv/bin/activate        # En Windows: venv\Scripts\activate

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Levantar el servidor
uvicorn app.main:app --reload
```

La API queda disponible en `http://localhost:8000`.

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Por defecto usa SQLite (`academia_virtual.db`, se crea solo). Para usar
PostgreSQL, definir la variable de entorno antes de levantar el servidor:

```bash
export DATABASE_URL="postgresql://usuario:password@localhost:5432/academia_virtual"
```

## Ejemplo de flujo completo (proceso de matrícula)

```bash
# 1. Crear datos base
curl -X POST localhost:8000/v1/docentes     -H "Content-Type: application/json" -d '{"titulo":"MSc","especialidad":"Software","experiencia":5}'
curl -X POST localhost:8000/v1/asignaturas  -H "Content-Type: application/json" -d '{"codigo":"SIS101","nombre":"Programación I","creditos":4,"nivel":"Primer semestre"}'
curl -X POST localhost:8000/v1/estudiantes  -H "Content-Type: application/json" -d '{"cedula":"1710000000","nombre":"Naim Michelena","direccion":"Quito","telefono":"0999999999"}'
curl -X POST localhost:8000/v1/grupos       -H "Content-Type: application/json" -d '{"modalidad":"Presencial","horario":"Lunes 08:00","cupo_maximo":30,"id_docente":1,"cod_asignatura":"SIS101"}'

# 2. Proceso de matrícula (diagrama de secuencia)
curl -X POST localhost:8000/v1/matriculas               -H "Content-Type: application/json" -d '{"fecha":"2026-06-22","id_estudiante":1,"id_grupo":1}'
curl -X POST localhost:8000/v1/matriculas/1/validar      -H "Content-Type: application/json" -d '{"aprobado": true}'
curl -X POST localhost:8000/v1/matriculas/1/pago         -H "Content-Type: application/json" -d '{"pago_realizado": true}'
curl -X POST localhost:8000/v1/matriculas/1/activar
```

## Integrantes y reparto de tareas

> Completar con los issues/tareas asignados en el repositorio (ver sección
> "Tareas de seguimiento" del tablero del proyecto).

| Integrante | Módulo asignado |
|---|---|
| | |
| | |
| | |


--
*Desarrollado y mantenido por eNanak (lproanoc869@gmail.com).*
