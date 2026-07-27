import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Estudiante, EstudianteCreate, EstudianteUpdate } from '../models/estudiante.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private api = inject(ApiService);
  private readonly endpoint = '/estudiantes';

  listar(): Observable<Estudiante[]> {
    return this.api.get<Estudiante>(this.endpoint);
  }

  obtenerPorId(id: number): Observable<Estudiante> {
    return this.api.getById<Estudiante>(this.endpoint, id);
  }

  crear(estudiante: EstudianteCreate): Observable<Estudiante[]> {
    return this.api.post<Estudiante>(this.endpoint, estudiante);
  }

  actualizar(id: number, estudiante: EstudianteUpdate): Observable<Estudiante[]> {
    return this.api.put<Estudiante>(this.endpoint, id, estudiante);
  }

  eliminar(id: number): Observable<Estudiante[]> {
    return this.api.delete<Estudiante>(this.endpoint, id);
  }
}
