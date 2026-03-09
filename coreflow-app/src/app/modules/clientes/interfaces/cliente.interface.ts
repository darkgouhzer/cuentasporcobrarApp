export type ClienteTipo = 'CLIENTE' | 'PROVEEDOR' | 'AMBOS';

export interface Cliente {
  idCliente: number;
  idUsuario: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  telefono?: string;
  email?: string;
  tipo: ClienteTipo;
  activo: boolean;
  fechaRegistro: string;
  fechaActualizacion?: string;
}

export interface CreateClienteDto {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  telefono?: string;
  email?: string;
  tipo: ClienteTipo;
}
