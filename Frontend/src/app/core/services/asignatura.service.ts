import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Asignatura, AsignaturaCreate, AsignaturaUpdate } from '../models/asignatura.model';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {
  private api = inject(ApiService);
  private readonly endpoint = '/asignaturas';

  listar(): Observable<Asignatura[]> {
    return this.api.get<Asignatura>(this.endpoint);
  }

  obtenerPorCodigo(codigo: string): Observable<Asignatura> {
    return this.api.getById<Asignatura>(this.endpoint, codigo);
  }

  crear(asignatura: AsignaturaCreate): Observable<Asignatura[]> {
    return this.api.post<Asignatura>(this.endpoint, asignatura);
  }

  actualizar(codigo: string, asignatura: AsignaturaUpdate): Observable<Asignatura[]> {
    return this.api.put<Asignatura>(this.endpoint, codigo, asignatura);
  }

  eliminar(codigo: string): Observable<Asignatura[]> {
    return this.api.delete<Asignatura>(this.endpoint, codigo);
  }
}
