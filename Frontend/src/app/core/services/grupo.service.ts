import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Grupo, GrupoCreate, GrupoUpdate } from '../models/grupo.model';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private api = inject(ApiService);
  private readonly endpoint = '/grupos';

  listar(): Observable<Grupo[]> {
    return this.api.get<Grupo>(this.endpoint);
  }

  obtenerPorId(id: number): Observable<Grupo> {
    return this.api.getById<Grupo>(this.endpoint, id);
  }

  crear(grupo: GrupoCreate): Observable<Grupo[]> {
    return this.api.post<Grupo>(this.endpoint, grupo);
  }

  actualizar(id: number, grupo: GrupoUpdate): Observable<Grupo[]> {
    return this.api.put<Grupo>(this.endpoint, id, grupo);
  }

  eliminar(id: number): Observable<Grupo[]> {
    return this.api.delete<Grupo>(this.endpoint, id);
  }
}
