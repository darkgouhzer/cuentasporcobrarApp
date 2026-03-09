import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CuentasService } from '../../services/cuentas.service';
import { ClientesService } from '../../../clientes/services/clientes.service';
import { Cliente } from '../../../clientes/interfaces/cliente.interface';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-cuenta-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SpinnerComponent],
  templateUrl: './cuenta-form.html',
  styleUrl: './cuenta-form.scss',
})
export class CuentaFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cuentasService = inject(CuentasService);
  private readonly clientesService = inject(ClientesService);
  private readonly router = inject(Router);

  clientes = signal<Cliente[]>([]);
  loading = signal(true);
  saving = signal(false);
  error = signal('');

  tipos = ['POR_COBRAR', 'POR_PAGAR'] as const;

  form = this.fb.group({
    idCliente: [null as number | null, Validators.required],
    tipo: ['POR_COBRAR', Validators.required],
    descripcion: [''],
    importeTotal: [0, [Validators.required, Validators.min(0.01)]],
    fechaVencimiento: [''],
  });

  ngOnInit() {
    this.clientesService.getAll().subscribe({
      next: data => {
        this.clientes.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar clientes');
        this.loading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const raw = this.form.value;
    const dto = {
      idCliente: Number(raw.idCliente),
      tipo: raw.tipo as any,
      descripcion: raw.descripcion || undefined,
      importeTotal: Number(raw.importeTotal),
      fechaVencimiento: raw.fechaVencimiento || undefined,
    };

    this.cuentasService.create(dto).subscribe({
      next: cuenta => this.router.navigate(['/cuentas', cuenta.idCuenta]),
      error: err => {
        this.error.set(err?.error?.message ?? 'Error al crear cuenta');
        this.saving.set(false);
      },
    });
  }

  goBack() {
    this.router.navigate(['/cuentas']);
  }
}
