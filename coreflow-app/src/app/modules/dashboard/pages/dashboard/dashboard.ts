import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  computed,
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientesService } from '../../../clientes/services/clientes.service';
import { CuentasService } from '../../../cuentas/services/cuentas.service';
import { Cuenta } from '../../../cuentas/interfaces/cuenta.interface';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SpinnerComponent, SlicePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardPage implements OnInit {
  private readonly clientesService = inject(ClientesService);
  private readonly cuentasService = inject(CuentasService);

  loading = signal(true);
  totalClientes = signal(0);
  cuentas = signal<Cuenta[]>([]);

  cuentasAbiertas = computed(() =>
    this.cuentas().filter(c => c.estado === 'ABIERTA'),
  );
  cuentasVencidas = computed(() =>
    this.cuentas().filter(c => c.estado === 'VENCIDA'),
  );
  saldoTotal = computed(() =>
    this.cuentasAbiertas().reduce((s, c) => s + Number(c.saldo), 0),
  );
  porCobrar = computed(() =>
    this.cuentasAbiertas()
      .filter(c => c.tipo === 'POR_COBRAR')
      .reduce((s, c) => s + Number(c.saldo), 0),
  );

  ngOnInit() {
    Promise.all([
      this.clientesService.getAll().toPromise(),
      this.cuentasService.getAll().toPromise(),
    ]).then(([clientes, cuentas]) => {
      this.totalClientes.set(clientes?.length ?? 0);
      this.cuentas.set(cuentas ?? []);
      this.loading.set(false);
    });
  }

  formatMoney(val: number) {
    return val.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  }
}
