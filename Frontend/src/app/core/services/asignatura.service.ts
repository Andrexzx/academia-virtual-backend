import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Asignatura, AsignaturaCreate, AsignaturaUpdate } from '../models/asignatura.model';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {
  private api = inject(ApiService);
  private readonly endpoint = '/asignaturas';

  private asignaturasSubject = new BehaviorSubject<Asignatura[]>([]);
  asignaturas$ = this.asignaturasSubject.asObservable();

  listar(): Observable<Asignatura[]> {
    return this.api.get<Asignatura>(this.endpoint).pipe(
      tap(data => this.asignaturasSubject.next(data))
    );
  }

  getCached(): Asignatura[] {
    return this.asignaturasSubject.getValue();
  }

  obtenerPorCodigo(codigo: string): Observable<Asignatura> {
    return this.api.getById<Asignatura>(this.endpoint, codigo);
  }

  crear(asignatura: AsignaturaCreate): Observable<Asignatura[]> {
    return this.api.post<Asignatura>(this.endpoint, asignatura).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  actualizar(codigo: string, asignatura: AsignaturaUpdate): Observable<Asignatura[]> {
    return this.api.put<Asignatura>(this.endpoint, codigo, asignatura).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  eliminar(codigo: string): Observable<Asignatura[]> {
    return this.api.delete<Asignatura>(this.endpoint, codigo).pipe(
      tap(() => this.listar().subscribe())
    );
  }
}
