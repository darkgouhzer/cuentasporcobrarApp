import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from '../constants';

export interface AuthUser {
  idUsuario: number;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthResponse {
  data: { token: string; usuario: AuthUser };
  message: string;
  statusCode: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API = `${API_URL}/auth`;

  currentUser = signal<AuthUser | null>(this.loadUser());

  private loadUser(): AuthUser | null {
    const token = localStorage.getItem('coreflow_token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        idUsuario: payload.idUsuario,
        nombre: payload.nombre ?? '',
        email: payload.email,
        rol: payload.rol,
      };
    } catch {
      return null;
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.API}/login`, { email, password })
      .pipe(
        tap(res => {
          localStorage.setItem('coreflow_token', res.data.token);
          this.currentUser.set(res.data.usuario);
        }),
      );
  }

  register(nombre: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.API}/register`, { nombre, email, password })
      .pipe(
        tap(res => {
          localStorage.setItem('coreflow_token', res.data.token);
          this.currentUser.set(res.data.usuario);
        }),
      );
  }

  logout() {
    localStorage.removeItem('coreflow_token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('coreflow_token');
  }
}
