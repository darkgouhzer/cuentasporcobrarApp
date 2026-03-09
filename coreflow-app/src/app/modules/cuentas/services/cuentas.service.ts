import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../../../core/constants';
import { Cuenta, CreateCuentaDto, CuentaTipo } from '../interfaces/cuenta.interface';

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

@Injectable({ providedIn: 'root' })
export class CuentasService {
  private readonly http = inject(HttpClient);
  private readonly API = `${API_URL}/cuentas`;

  getAll(tipo?: CuentaTipo) {
    const params = tipo ? new HttpParams().set('tipo', tipo) : undefined;
    return this.http
      .get<ApiResponse<Cuenta[]>>(this.API, { params })
      .pipe(map(r => r.data));
  }

  getOne(id: number) {
    return this.http
      .get<ApiResponse<Cuenta>>(`${this.API}/${id}`)
      .pipe(map(r => r.data));
  }

  create(dto: CreateCuentaDto) {
    return this.http
      .post<ApiResponse<Cuenta>>(this.API, dto)
      .pipe(map(r => r.data));
  }

  updateEstado(id: number, estado: 'CANCELADA' | 'VENCIDA') {
    return this.http
      .patch<ApiResponse<Cuenta>>(`${this.API}/${id}`, { estado })
      .pipe(map(r => r.data));
  }
}
