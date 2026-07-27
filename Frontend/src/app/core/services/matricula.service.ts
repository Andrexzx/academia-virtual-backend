import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Matricula,
  MatriculaCreate,
  ValidarRequisitosIn,
  ConfirmarPagoIn
} from '../models/matricula.model';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private api = inject(ApiService);
  private readonly endpoint = '/matriculas';

  listar(): Observable<Matricula[]> {
    return this.api.get<Matricula>(this.endpoint);
  }

  obtenerPorId(id: number): Observable<Matricula> {
    return this.api.getById<Matricula>(this.endpoint, id);
  }

  crear(matricula: MatriculaCreate): Observable<Matricula[]> {
    return this.api.post<Matricula>(this.endpoint, matricula);
  }

  validarRequisitos(id: number, aprobado: boolean): Observable<Matricula[]> {
    const body: ValidarRequisitosIn = { aprobado };
    return this.api.post<Matricula>(`${this.endpoint}/${id}/validar`, body);
  }

  confirmarPago(id: number, pagoRealizado: boolean): Observable<Matricula[]> {
    const body: ConfirmarPagoIn = { pago_realizado: pagoRealizado };
    return this.api.post<Matricula>(`${this.endpoint}/${id}/pago`, body);
  }

  activar(id: number): Observable<Matricula[]> {
    return this.api.post<Matricula>(`${this.endpoint}/${id}/activar`, {});
  }

  finalizar(id: number): Observable<Matricula[]> {
    return this.api.post<Matricula>(`${this.endpoint}/${id}/finalizar`, {});
  }
}
