import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ConceptosService } from '../../services/conceptos.service';
import { Concepto, ConceptoTipo } from '../../interfaces/concepto.interface';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-conceptos-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, SpinnerComponent, DecimalPipe],
  templateUrl: './conceptos-list.html',
  styleUrl: './conceptos-list.scss',
})
export class ConceptosListPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly conceptosService = inject(ConceptosService);

  conceptos = signal<Concepto[]>([]);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  editingId = signal<number | null>(null);
  error = signal('');

  tipos: ConceptoTipo[] = ['PRODUCTO', 'SERVICIO', 'HORA_TRABAJO', 'OTRO'];

  form = this.fb.group({
    nombre: ['', Validators.required],
    tipo: ['SERVICIO' as ConceptoTipo, Validators.required],
    precioDefault: [0],
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.conceptosService.getAll().subscribe({
      next: data => {
        this.conceptos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar conceptos');
        this.loading.set(false);
      },
    });
  }

  openForm(concepto?: Concepto) {
    if (concepto) {
      this.editingId.set(concepto.idConcepto);
      this.form.patchValue(concepto);
    } else {
      this.editingId.set(null);
      this.form.reset({ nombre: '', tipo: 'SERVICIO', precioDefault: 0 });
    }
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.error.set('');
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving.set(true);
    const dto = this.form.value as any;
    const id = this.editingId();

    const obs$ = id
      ? this.conceptosService.update(id, dto)
      : this.conceptosService.create(dto);

    obs$.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
        this.load();
      },
      error: err => {
        this.error.set(err?.error?.message ?? 'Error al guardar');
        this.saving.set(false);
      },
    });
  }

  eliminar(concepto: Concepto) {
    if (concepto.idUsuario === null) return; // No eliminar globales del sistema
    if (!confirm('¿Eliminar este concepto?')) return;
    this.conceptosService.remove(concepto.idConcepto).subscribe({
      next: () =>
        this.conceptos.update(list =>
          list.filter(c => c.idConcepto !== concepto.idConcepto),
        ),
    });
  }

  isGlobal(c: Concepto) {
    return c.idUsuario === null;
  }
}
