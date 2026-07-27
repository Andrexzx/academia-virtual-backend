import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Docente, DocenteCreate, DocenteUpdate } from '../models/docente.model';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private api = inject(ApiService);
  private readonly endpoint = '/docentes';

  listar(): Observable<Docente[]> {
    return this.api.get<Docente>(this.endpoint);
  }

  obtenerPorId(id: number): Observable<Docente> {
    return this.api.getById<Docente>(this.endpoint, id);
  }

  crear(docente: DocenteCreate): Observable<Docente[]> {
    return this.api.post<Docente>(this.endpoint, docente);
  }

  actualizar(id: number, docente: DocenteUpdate): Observable<Docente[]> {
    return this.api.put<Docente>(this.endpoint, id, docente);
  }

  eliminar(id: number): Observable<Docente[]> {
    return this.api.delete<Docente>(this.endpoint, id);
  }
}
