import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientesService } from '../../services/clientes.service';
import { Cliente } from '../../interfaces/cliente.interface';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SpinnerComponent],
  templateUrl: './clientes-list.html',
  styleUrl: './clientes-list.scss',
})
export class ClientesListPage implements OnInit {
  private readonly clientesService = inject(ClientesService);

  clientes = signal<Cliente[]>([]);
  loading = signal(true);
  error = signal('');

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

  eliminar(id: number) {
    if (!confirm('¿Eliminar este cliente?')) return;
    this.clientesService.remove(id).subscribe({
      next: () =>
        this.clientes.update(list => list.filter(c => c.idCliente !== id)),
    });
  }

  tipoLabel(tipo: string) {
    const map: Record<string, string> = {
      CLIENTE: 'Cliente',
      PROVEEDOR: 'Proveedor',
      AMBOS: 'Ambos',
    };
    return map[tipo] ?? tipo;
  }
}
