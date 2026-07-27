import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseRest } from '../models/response-rest.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(endpoint: string): Observable<T[]> {
    return this.http.get<ResponseRest<T>>(`${this.baseUrl}${endpoint}`).pipe(
      map(res => this.handleResponse(res)),
      catchError(err => this.handleError(err))
    );
  }

  getById<T>(endpoint: string, id: number | string): Observable<T> {
    return this.http.get<ResponseRest<T>>(`${this.baseUrl}${endpoint}/${id}`).pipe(
      map(res => {
        const items = this.handleResponse(res);
        if (items.length === 0) {
          throw new Error('Recurso no encontrado');
        }
        return items[0];
      }),
      catchError(err => this.handleError(err))
    );
  }

  post<T>(endpoint: string, body: any): Observable<T[]> {
    return this.http.post<ResponseRest<T>>(`${this.baseUrl}${endpoint}`, body).pipe(
      map(res => this.handleResponse(res)),
      catchError(err => this.handleError(err))
    );
  }

  put<T>(endpoint: string, id: number | string, body: any): Observable<T[]> {
    return this.http.put<ResponseRest<T>>(`${this.baseUrl}${endpoint}/${id}`, body).pipe(
      map(res => this.handleResponse(res)),
      catchError(err => this.handleError(err))
    );
  }

  delete<T>(endpoint: string, id: number | string): Observable<T[]> {
    return this.http.delete<ResponseRest<T>>(`${this.baseUrl}${endpoint}/${id}`).pipe(
      map(res => this.handleResponse(res)),
      catchError(err => this.handleError(err))
    );
  }

  private handleResponse<T>(res: ResponseRest<T>): T[] {
    const errorInfo = res.info_list?.find(i => i.codigo === 2 || i.estado === 0);
    if (errorInfo) {
      throw new Error(errorInfo.mensaje || 'Error en el servidor');
    }
    return res.data || [];
  }

  private handleError(error: any): Observable<never> {
    const msg = error.error?.detail || error.message || 'Error de conexión con la API';
    return throwError(() => new Error(msg));
  }
}
