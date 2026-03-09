import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ClientesService } from '../../services/clientes.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SpinnerComponent],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.scss',
})
export class ClienteFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly clientesService = inject(ClientesService);
  private readonly router = inject(Router);

  // Recibe el :id del route via withComponentInputBinding()
  id = input<string>();

  loading = signal(false);
  saving = signal(false);
  error = signal('');
  isEdit = signal(false);

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellidoPaterno: ['', Validators.required],
    apellidoMaterno: [''],
    telefono: [''],
    email: ['', Validators.email],
    tipo: ['CLIENTE', Validators.required],
  });

  tipos = ['CLIENTE', 'PROVEEDOR', 'AMBOS'] as const;

  ngOnInit() {
    const idVal = this.id();
    if (idVal) {
      this.isEdit.set(true);
      this.loading.set(true);
      this.clientesService.getOne(Number(idVal)).subscribe({
        next: cliente => {
          this.form.patchValue(cliente);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar el cliente');
          this.loading.set(false);
        },
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const dto = this.form.value as any;

    const obs$ = this.isEdit()
      ? this.clientesService.update(Number(this.id()), dto)
      : this.clientesService.create(dto);

    obs$.subscribe({
      next: () => this.router.navigate(['/clientes']),
      error: err => {
        this.error.set(err?.error?.message ?? 'Error al guardar');
        this.saving.set(false);
      },
    });
  }

  goBack() {
    this.router.navigate(['/clientes']);
  }
}
