import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../../../core/constants';
import { Movimiento, CreateMovimientoDto } from '../interfaces/cuenta.interface';

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private readonly http = inject(HttpClient);
  private readonly API = `${API_URL}/movimientos`;

  getByCuenta(idCuenta: number) {
    return this.http
      .get<ApiResponse<Movimiento[]>>(`${this.API}/cuenta/${idCuenta}`)
      .pipe(map(r => r.data));
  }

  create(dto: CreateMovimientoDto) {
    return this.http
      .post<ApiResponse<Movimiento>>(this.API, dto)
      .pipe(map(r => r.data));
  }
}
