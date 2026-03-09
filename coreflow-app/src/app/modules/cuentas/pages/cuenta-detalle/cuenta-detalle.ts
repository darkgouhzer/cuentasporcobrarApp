import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
  input,
  computed,
} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CuentasService } from '../../services/cuentas.service';
import { CuentaDetalleService } from '../../services/cuenta-detalle.service';
import { MovimientosService } from '../../services/movimientos.service';
import { ConceptosService } from '../../../conceptos/services/conceptos.service';
import {
  Cuenta,
  CuentaDetalle,
  Movimiento,
} from '../../interfaces/cuenta.interface';
import { Concepto } from '../../../conceptos/interfaces/concepto.interface';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-cuenta-detalle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SpinnerComponent, SlicePipe],
  templateUrl: './cuenta-detalle.html',
  styleUrl: './cuenta-detalle.scss',
})
export class CuentaDetallePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cuentasService = inject(CuentasService);
  private readonly detalleService = inject(CuentaDetalleService);
  private readonly movimientosService = inject(MovimientosService);
  private readonly conceptosService = inject(ConceptosService);
  private readonly router = inject(Router);

  id = input<string>();

  cuenta = signal<Cuenta | null>(null);
  detalles = signal<CuentaDetalle[]>([]);
  movimientos = signal<Movimiento[]>([]);
  conceptos = signal<Concepto[]>([]);
  loading = signal(true);
  error = signal('');

  showDetalleForm = signal(false);
  showMovForm = signal(false);
  savingDetalle = signal(false);
  savingMov = signal(false);

  tiposConcepto = ['PRODUCTO', 'SERVICIO', 'HORA_TRABAJO', 'OTRO'] as const;
  tiposMovimiento = ['ABONO', 'CARGO', 'AJUSTE', 'CANCELACION'] as const;

  detalleForm = this.fb.group({
    idConcepto: [null as number | null],
    descripcion: [''],
    tipoConcepto: ['SERVICIO', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(0.01)]],
    precioUnitario: [0, [Validators.required, Validators.min(0)]],
  });

  movForm = this.fb.group({
    tipo: ['ABONO', Validators.required],
    importe: [0, [Validators.required, Validators.min(0.01)]],
    referencia: [''],
    notas: [''],
  });

  importePreview = computed(() => {
    const cantidad = Number(this.detalleForm.value.cantidad ?? 0);
    const precio = Number(this.detalleForm.value.precioUnitario ?? 0);
    return (cantidad * precio).toFixed(2);
  });

  ngOnInit() {
    const idVal = Number(this.id());
    Promise.all([
      this.cuentasService.getOne(idVal).toPromise(),
      this.detalleService.getByCuenta(idVal).toPromise(),
      this.movimientosService.getByCuenta(idVal).toPromise(),
      this.conceptosService.getAll().toPromise(),
    ])
      .then(([cuenta, detalles, movimientos, conceptos]) => {
        this.cuenta.set(cuenta ?? null);
        this.detalles.set(detalles ?? []);
        this.movimientos.set(movimientos ?? []);
        this.conceptos.set(conceptos ?? []);
        this.loading.set(false);
      })
      .catch(() => {
        this.error.set('Error al cargar la cuenta');
        this.loading.set(false);
      });
  }

  reloadCuenta() {
    const idVal = Number(this.id());
    this.cuentasService.getOne(idVal).subscribe(c => this.cuenta.set(c));
  }

  saveDetalle() {
    if (this.detalleForm.invalid) return;
    this.savingDetalle.set(true);
    const val = this.detalleForm.value;
    this.detalleService
      .create({
        idCuenta: Number(this.id()),
        idConcepto: val.idConcepto ? Number(val.idConcepto) : undefined,
        descripcion: val.descripcion || undefined,
        tipoConcepto: val.tipoConcepto as any,
        cantidad: Number(val.cantidad),
        precioUnitario: Number(val.precioUnitario),
      })
      .subscribe({
        next: d => {
          this.detalles.update(list => [...list, d]);
          this.detalleForm.reset({ tipoConcepto: 'SERVICIO', cantidad: 1, precioUnitario: 0 });
          this.showDetalleForm.set(false);
          this.savingDetalle.set(false);
          this.reloadCuenta();
        },
        error: err => {
          this.error.set(err?.error?.message ?? 'Error al agregar detalle');
          this.savingDetalle.set(false);
        },
      });
  }

  eliminarDetalle(id: number) {
    if (!confirm('¿Eliminar este concepto de la cuenta?')) return;
    this.detalleService.remove(id).subscribe({
      next: () => {
        this.detalles.update(list => list.filter(d => d.idDetalle !== id));
        this.reloadCuenta();
      },
    });
  }

  saveMovimiento() {
    if (this.movForm.invalid) return;
    this.savingMov.set(true);
    const val = this.movForm.value;
    this.movimientosService
      .create({
        idCuenta: Number(this.id()),
        tipo: val.tipo as any,
        importe: Number(val.importe),
        referencia: val.referencia || undefined,
        notas: val.notas || undefined,
      })
      .subscribe({
        next: m => {
          this.movimientos.update(list => [...list, m]);
          this.movForm.reset({ tipo: 'ABONO', importe: 0 });
          this.showMovForm.set(false);
          this.savingMov.set(false);
          this.reloadCuenta();
        },
        error: err => {
          this.error.set(err?.error?.message ?? 'Error al registrar movimiento');
          this.savingMov.set(false);
        },
      });
  }

  cancelarCuenta() {
    if (!confirm('¿Cancelar esta cuenta?')) return;
    this.cuentasService.updateEstado(Number(this.id()), 'CANCELADA').subscribe({
      next: c => this.cuenta.set(c),
    });
  }

  goBack() {
    this.router.navigate(['/cuentas']);
  }

  formatMoney(val: number | string) {
    return Number(val).toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
  }

  onConceptoChange(event: Event) {
    const idConcepto = Number((event.target as HTMLSelectElement).value);
    if (!idConcepto) return;
    const concepto = this.conceptos().find(c => c.idConcepto === idConcepto);
    if (concepto) {
      this.detalleForm.patchValue({
        tipoConcepto: concepto.tipo,
        precioUnitario: Number(concepto.precioDefault),
        descripcion: concepto.nombre,
      });
    }
  }
}
