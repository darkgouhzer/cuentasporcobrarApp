import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../../../core/constants';
import { Cliente, CreateClienteDto } from '../interfaces/cliente.interface';

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private readonly http = inject(HttpClient);
  private readonly API = `${API_URL}/clientes`;

  getAll() {
    return this.http
      .get<ApiResponse<Cliente[]>>(this.API)
      .pipe(map(r => r.data));
  }

  getOne(id: number) {
    return this.http
      .get<ApiResponse<Cliente>>(`${this.API}/${id}`)
      .pipe(map(r => r.data));
  }

  create(dto: CreateClienteDto) {
    return this.http
      .post<ApiResponse<Cliente>>(this.API, dto)
      .pipe(map(r => r.data));
  }

  update(id: number, dto: Partial<CreateClienteDto>) {
    return this.http
      .patch<ApiResponse<Cliente>>(`${this.API}/${id}`, dto)
      .pipe(map(r => r.data));
  }

  remove(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`);
  }
}
