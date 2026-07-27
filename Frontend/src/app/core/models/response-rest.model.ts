export interface InfoRest {
  codigo: number;
  mensaje: string;
  estado: number;
}

export interface ResponseRest<T> {
  data: T[];
  info_list: InfoRest[];
}
