import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isRegister = signal(false);
  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    nombre: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  toggleMode() {
    this.isRegister.update(v => !v);
    this.error.set('');
    this.form.reset();
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const { email, password, nombre } = this.form.value;

    const obs$ = this.isRegister()
      ? this.authService.register(nombre!, email!, password!)
      : this.authService.login(email!, password!);

    obs$.subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        this.error.set(err?.error?.message ?? 'Error al iniciar sesión');
        this.loading.set(false);
      },
    });
  }
}
