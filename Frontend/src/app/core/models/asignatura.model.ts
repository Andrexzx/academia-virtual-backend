export interface Asignatura {
  codigo: string;
  nombre: string;
  creditos: number;
  nivel: string;
}

export interface AsignaturaCreate {
  codigo: string;
  nombre: string;
  creditos: number;
  nivel: string;
}

export interface AsignaturaUpdate {
  nombre: string;
  creditos: number;
  nivel: string;
}
