export interface Grupo {
  id_grupo: number;
  modalidad: string;
  horario: string;
  cupo_maximo: number;
  id_docente: number;
  cod_asignatura: string;
}

export interface GrupoCreate {
  modalidad: string;
  horario: string;
  cupo_maximo: number;
  id_docente: number;
  cod_asignatura: string;
}

export interface GrupoUpdate {
  modalidad: string;
  horario: string;
  cupo_maximo: number;
  id_docente: number;
  cod_asignatura: string;
}
