import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
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

  private matriculasSubject = new BehaviorSubject<Matricula[]>([]);
  matriculas$ = this.matriculasSubject.asObservable();

  listar(): Observable<Matricula[]> {
    return this.api.get<Matricula>(this.endpoint).pipe(
      tap(data => this.matriculasSubject.next(data))
    );
  }

  getCached(): Matricula[] {
    return this.matriculasSubject.getValue();
  }

  obtenerPorId(id: number): Observable<Matricula> {
    return this.api.getById<Matricula>(this.endpoint, id);
  }

  crear(matricula: MatriculaCreate): Observable<Matricula[]> {
    return this.api.post<Matricula>(this.endpoint, matricula).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  validarRequisitos(id: number, aprobado: boolean): Observable<Matricula[]> {
    const body: ValidarRequisitosIn = { aprobado };
    return this.api.post<Matricula>(`${this.endpoint}/${id}/validar`, body).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  confirmarPago(id: number, pagoRealizado: boolean): Observable<Matricula[]> {
    const body: ConfirmarPagoIn = { pago_realizado: pagoRealizado };
    return this.api.post<Matricula>(`${this.endpoint}/${id}/pago`, body).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  activar(id: number): Observable<Matricula[]> {
    return this.api.post<Matricula>(`${this.endpoint}/${id}/activar`, {}).pipe(
      tap(() => this.listar().subscribe())
    );
  }

  finalizar(id: number): Observable<Matricula[]> {
    return this.api.post<Matricula>(`${this.endpoint}/${id}/finalizar`, {}).pipe(
      tap(() => this.listar().subscribe())
    );
  }
}
