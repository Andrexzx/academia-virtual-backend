import os
import sys
import pytest
from mockito import unstub

# Agregar la raíz del proyecto al sys.path para que python pueda encontrar el módulo 'app'
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

@pytest.fixture(autouse=True)
def cleanup_mocks():
    """Limpia automáticamente los mocks creados con Mockito después de cada prueba."""
    yield
    unstub()
