import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Grupo, GrupoCreate, GrupoUpdate } from '../models/grupo.model';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private api = inject(ApiService);
  private readonly endpoint = '/grupos';

  private gruposSubject = new BehaviorSubject<Grupo[]>([]);
  grupos$ = this.gruposSubject.asObservable();

  listar(): Observable<Grupo[]> {
    return this.api.get<Grupo>(this.endpoint).pipe(
      tap(data => this.gruposSubject.next(data))
    );
  }

  getCached(): Grupo[] {
    return this.gruposSubject.getValue();
  }

  obtenerPorId(id: number): Observable<Grupo> {
    return this.api.getById<Grupo>(this.endpoint, id);
  }

  crear(grupo: GrupoCreate): Observable<Grupo[]> {
    return this.api.post<Grupo>(this.endpoint, grupo).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  actualizar(id: number, grupo: GrupoUpdate): Observable<Grupo[]> {
    return this.api.put<Grupo>(this.endpoint, id, grupo).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  eliminar(id: number): Observable<Grupo[]> {
    return this.api.delete<Grupo>(this.endpoint, id).pipe(
      tap(() => this.listar().subscribe())
    );
  }
}
