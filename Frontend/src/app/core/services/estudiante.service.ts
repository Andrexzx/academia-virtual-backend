import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Estudiante, EstudianteCreate, EstudianteUpdate } from '../models/estudiante.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private api = inject(ApiService);
  private readonly endpoint = '/estudiantes';

  private estudiantesSubject = new BehaviorSubject<Estudiante[]>([]);
  estudiantes$ = this.estudiantesSubject.asObservable();

  listar(): Observable<Estudiante[]> {
    return this.api.get<Estudiante>(this.endpoint).pipe(
      tap(data => this.estudiantesSubject.next(data))
    );
  }

  getCached(): Estudiante[] {
    return this.estudiantesSubject.getValue();
  }

  obtenerPorId(id: number): Observable<Estudiante> {
    return this.api.getById<Estudiante>(this.endpoint, id);
  }

  crear(estudiante: EstudianteCreate): Observable<Estudiante[]> {
    return this.api.post<Estudiante>(this.endpoint, estudiante).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  actualizar(id: number, estudiante: EstudianteUpdate): Observable<Estudiante[]> {
    return this.api.put<Estudiante>(this.endpoint, id, estudiante).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  eliminar(id: number): Observable<Estudiante[]> {
    return this.api.delete<Estudiante>(this.endpoint, id).pipe(
      tap(() => this.listar().subscribe())
    );
  }
}
