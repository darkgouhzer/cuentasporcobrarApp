export type ConceptoTipo = 'PRODUCTO' | 'SERVICIO' | 'HORA_TRABAJO' | 'OTRO';

export interface Concepto {
  idConcepto: number;
  idUsuario: number | null;
  nombre: string;
  tipo: ConceptoTipo;
  precioDefault: number;
  activo: boolean;
}

export interface CreateConceptoDto {
  nombre: string;
  tipo: ConceptoTipo;
  precioDefault?: number;
}
