export interface Cliente {
  idCliente: number;
  idUsuario: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  telefono?: string | null;
  email?: string | null;
  tipo: 'CLIENTE' | 'PROVEEDOR' | 'AMBOS';
  activo: boolean;
  fechaRegistro: Date;
  fechaActualizacion?: Date | null;
}
