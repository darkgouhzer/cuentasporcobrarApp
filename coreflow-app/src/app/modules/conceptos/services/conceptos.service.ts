import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_URL } from '../../../core/constants';
import { Concepto, CreateConceptoDto } from '../interfaces/concepto.interface';

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

@Injectable({ providedIn: 'root' })
export class ConceptosService {
  private readonly http = inject(HttpClient);
  private readonly API = `${API_URL}/conceptos`;

  getAll() {
    return this.http
      .get<ApiResponse<Concepto[]>>(this.API)
      .pipe(map(r => r.data));
  }

  create(dto: CreateConceptoDto) {
    return this.http
      .post<ApiResponse<Concepto>>(this.API, dto)
      .pipe(map(r => r.data));
  }

  update(id: number, dto: Partial<CreateConceptoDto>) {
    return this.http
      .patch<ApiResponse<Concepto>>(`${this.API}/${id}`, dto)
      .pipe(map(r => r.data));
  }

  remove(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.API}/${id}`);
  }
}
