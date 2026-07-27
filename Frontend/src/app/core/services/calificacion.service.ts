import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Calificacion, CalificacionCreate, CalificacionUpdate } from '../models/calificacion.model';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {
  private api = inject(ApiService);
  private readonly endpoint = '/calificaciones';

  private calificacionesSubject = new BehaviorSubject<Calificacion[]>([]);
  calificaciones$ = this.calificacionesSubject.asObservable();

  listar(): Observable<Calificacion[]> {
    return this.api.get<Calificacion>(this.endpoint).pipe(
      tap(data => this.calificacionesSubject.next(data))
    );
  }

  getCached(): Calificacion[] {
    return this.calificacionesSubject.getValue();
  }

  obtenerPorId(id: number): Observable<Calificacion> {
    return this.api.getById<Calificacion>(this.endpoint, id);
  }

  crear(calificacion: CalificacionCreate): Observable<Calificacion[]> {
    return this.api.post<Calificacion>(this.endpoint, calificacion).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  actualizar(id: number, calificacion: CalificacionUpdate): Observable<Calificacion[]> {
    return this.api.put<Calificacion>(this.endpoint, id, calificacion).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  eliminar(id: number): Observable<Calificacion[]> {
    return this.api.delete<Calificacion>(this.endpoint, id).pipe(
      tap(() => this.listar().subscribe())
    );
  }
}
