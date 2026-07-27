import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Comprobante, ComprobanteCreate } from '../models/comprobante.model';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {
  private api = inject(ApiService);
  private readonly endpoint = '/comprobantes';

  private comprobantesSubject = new BehaviorSubject<Comprobante[]>([]);
  comprobantes$ = this.comprobantesSubject.asObservable();

  listar(): Observable<Comprobante[]> {
    return this.api.get<Comprobante>(this.endpoint).pipe(
      tap(data => this.comprobantesSubject.next(data))
    );
  }

  getCached(): Comprobante[] {
    return this.comprobantesSubject.getValue();
  }

  obtenerPorId(id: number): Observable<Comprobante> {
    return this.api.getById<Comprobante>(this.endpoint, id);
  }

  crear(comprobante: ComprobanteCreate): Observable<Comprobante[]> {
    return this.api.post<Comprobante>(this.endpoint, comprobante).pipe(
      tap(() => this.listar().subscribe())
    );
  }
}
