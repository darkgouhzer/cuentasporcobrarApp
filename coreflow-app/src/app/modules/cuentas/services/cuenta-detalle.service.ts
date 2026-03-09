import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../../../core/constants';
import { CuentaDetalle, CreateDetalleDto } from '../interfaces/cuenta.interface';

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

@Injectable({ providedIn: 'root' })
export class CuentaDetalleService {
  private readonly http = inject(HttpClient);
  private readonly API = `${API_URL}/cuenta-detalle`;

  getByCuenta(idCuenta: number) {
    return this.http
      .get<ApiResponse<CuentaDetalle[]>>(`${this.API}/cuenta/${idCuenta}`)
      .pipe(map(r => r.data));
  }

  create(dto: CreateDetalleDto) {
    return this.http
      .post<ApiResponse<CuentaDetalle>>(this.API, dto)
      .pipe(map(r => r.data));
  }

  remove(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`);
  }
}
