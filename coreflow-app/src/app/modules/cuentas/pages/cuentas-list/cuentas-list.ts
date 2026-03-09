import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CuentasService } from '../../services/cuentas.service';
import { Cuenta, CuentaTipo } from '../../interfaces/cuenta.interface';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-cuentas-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SpinnerComponent, SlicePipe],
  templateUrl: './cuentas-list.html',
  styleUrl: './cuentas-list.scss',
})
export class CuentasListPage implements OnInit {
  private readonly cuentasService = inject(CuentasService);

  cuentas = signal<Cuenta[]>([]);
  loading = signal(true);
  error = signal('');
  filtroTipo = signal<CuentaTipo | undefined>(undefined);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.cuentasService.getAll(this.filtroTipo()).subscribe({
      next: data => {
        this.cuentas.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar cuentas');
        this.loading.set(false);
      },
    });
  }

  setFiltro(tipo: CuentaTipo | undefined) {
    this.filtroTipo.set(tipo);
    this.load();
  }

  estadoClass(estado: string) {
    const map: Record<string, string> = {
      ABIERTA: 'warning',
      PAGADA: 'success',
      VENCIDA: 'danger',
      CANCELADA: 'muted',
    };
    return map[estado] ?? '';
  }

  formatMoney(val: number | string) {
    return Number(val).toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
  }
}
