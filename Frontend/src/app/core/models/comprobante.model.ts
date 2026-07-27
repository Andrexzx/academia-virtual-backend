export interface Comprobante {
  id_comprobante: number;
  fecha: string;
  subtotal: number;
  iva: number;
  total: number;
  id_matricula: number;
}

export interface ComprobanteCreate {
  fecha: string;
  subtotal: number;
  id_matricula: number;
}
