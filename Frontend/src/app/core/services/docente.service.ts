import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Docente, DocenteCreate, DocenteUpdate } from '../models/docente.model';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private api = inject(ApiService);
  private readonly endpoint = '/docentes';

  private docentesSubject = new BehaviorSubject<Docente[]>([]);
  docentes$ = this.docentesSubject.asObservable();

  listar(): Observable<Docente[]> {
    return this.api.get<Docente>(this.endpoint).pipe(
      tap(data => this.docentesSubject.next(data))
    );
  }

  getCached(): Docente[] {
    return this.docentesSubject.getValue();
  }

  obtenerPorId(id: number): Observable<Docente> {
    return this.api.getById<Docente>(this.endpoint, id);
  }

  crear(docente: DocenteCreate): Observable<Docente[]> {
    return this.api.post<Docente>(this.endpoint, docente).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  actualizar(id: number, docente: DocenteUpdate): Observable<Docente[]> {
    return this.api.put<Docente>(this.endpoint, id, docente).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  eliminar(id: number): Observable<Docente[]> {
    return this.api.delete<Docente>(this.endpoint, id).pipe(
      tap(() => this.listar().subscribe())
    );
  }
}
