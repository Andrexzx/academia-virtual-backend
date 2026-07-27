export interface Estudiante {
  id_estudiante: number;
  cedula: string;
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface EstudianteCreate {
  cedula: string;
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface EstudianteUpdate {
  cedula: string;
  nombre: string;
  direccion: string;
  telefono: string;
}
