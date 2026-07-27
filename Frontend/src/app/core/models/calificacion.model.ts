export interface Calificacion {
  id_calificacion: number;
  parcial1: number;
  parcial2: number;
  examen_final: number;
  id_estudiante: number;
  cod_asignatura: string;
  promedio?: number;
}

export interface CalificacionCreate {
  parcial1: number;
  parcial2: number;
  examen_final: number;
  id_estudiante: number;
  cod_asignatura: string;
}

export interface CalificacionUpdate {
  parcial1: number;
  parcial2: number;
  examen_final: number;
  id_estudiante: number;
  cod_asignatura: string;
}
