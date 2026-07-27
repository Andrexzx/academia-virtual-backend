export type EstadoMatricula =
  | 'Preinscrito'
  | 'Pendiente pago'
  | 'Matriculado'
  | 'Activo'
  | 'Finalizado'
  | 'Cancelado'
  | 'Anulado';

export interface Matricula {
  id_matricula: number;
  fecha: string;
  estado: EstadoMatricula;
  id_estudiante: number;
  id_grupo: number;
}

export interface MatriculaCreate {
  fecha: string;
  id_estudiante: number;
  id_grupo: number;
}

export interface ValidarRequisitosIn {
  aprobado: boolean;
}

export interface ConfirmarPagoIn {
  pago_realizado: boolean;
}
