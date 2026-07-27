import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Calificacion, CalificacionCreate, CalificacionUpdate } from '../models/calificacion.model';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {
  private api = inject(ApiService);
  private readonly endpoint = '/calificaciones';

  listar(): Observable<Calificacion[]> {
    return this.api.get<Calificacion>(this.endpoint);
  }

  obtenerPorId(id: number): Observable<Calificacion> {
    return this.api.getById<Calificacion>(this.endpoint, id);
  }

  crear(calificacion: CalificacionCreate): Observable<Calificacion[]> {
    return this.api.post<Calificacion>(this.endpoint, calificacion);
  }

  actualizar(id: number, calificacion: CalificacionUpdate): Observable<Calificacion[]> {
    return this.api.put<Calificacion>(this.endpoint, id, calificacion);
  }

  eliminar(id: number): Observable<Calificacion[]> {
    return this.api.delete<Calificacion>(this.endpoint, id);
  }
}
