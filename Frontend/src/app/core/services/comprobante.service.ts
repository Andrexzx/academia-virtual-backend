import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Comprobante, ComprobanteCreate } from '../models/comprobante.model';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {
  private api = inject(ApiService);
  private readonly endpoint = '/comprobantes';

  listar(): Observable<Comprobante[]> {
    return this.api.get<Comprobante>(this.endpoint);
  }

  obtenerPorId(id: number): Observable<Comprobante> {
    return this.api.getById<Comprobante>(this.endpoint, id);
  }

  crear(comprobante: ComprobanteCreate): Observable<Comprobante[]> {
    return this.api.post<Comprobante>(this.endpoint, comprobante);
  }
}
