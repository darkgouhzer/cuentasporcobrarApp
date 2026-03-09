export type CuentaTipo = 'POR_COBRAR' | 'POR_PAGAR';
export type CuentaEstado = 'ABIERTA' | 'PAGADA' | 'VENCIDA' | 'CANCELADA';
export type MovimientoTipo = 'ABONO' | 'CARGO' | 'AJUSTE' | 'CANCELACION';
export type ConceptoTipo = 'PRODUCTO' | 'SERVICIO' | 'HORA_TRABAJO' | 'OTRO';

export interface Cuenta {
  idCuenta: number;
  idCliente: number;
  tipo: CuentaTipo;
  estado: CuentaEstado;
  descripcion?: string;
  importeTotal: number;
  importePagado: number;
  saldo: number;
  fechaEmision: string;
  fechaVencimiento?: string;
  fechaActualizacion?: string;
  cliente?: { nombre: string; apellidoPaterno: string };
}

export interface CreateCuentaDto {
  idCliente: number;
  tipo: CuentaTipo;
  descripcion?: string;
  importeTotal: number;
  fechaVencimiento?: string;
}

export interface Movimiento {
  idMovimiento: number;
  idCuenta: number;
  tipo: MovimientoTipo;
  importe: number;
  referencia?: string;
  notas?: string;
  fecha: string;
}

export interface CreateMovimientoDto {
  idCuenta: number;
  tipo: MovimientoTipo;
  importe: number;
  referencia?: string;
  notas?: string;
}

export interface CuentaDetalle {
  idDetalle: number;
  idCuenta: number;
  idConcepto?: number;
  descripcion?: string;
  tipoConcepto: ConceptoTipo;
  cantidad: number;
  precioUnitario: number;
  importe: number;
  fecha: string;
}

export interface CreateDetalleDto {
  idCuenta: number;
  idConcepto?: number;
  descripcion?: string;
  tipoConcepto: ConceptoTipo;
  cantidad: number;
  precioUnitario: number;
}
