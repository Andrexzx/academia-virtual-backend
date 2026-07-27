export interface Docente {
  id_docente: number;
  titulo: string;
  especialidad: string;
  experiencia: number;
}

export interface DocenteCreate {
  titulo: string;
  especialidad: string;
  experiencia: number;
}

export interface DocenteUpdate {
  titulo: string;
  especialidad: string;
  experiencia: number;
}
