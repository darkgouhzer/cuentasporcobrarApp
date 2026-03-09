import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCuentaDto {
  @IsNotEmpty()
  idCliente: number;

  @IsEnum(['POR_COBRAR', 'POR_PAGAR'])
  tipo: 'POR_COBRAR' | 'POR_PAGAR';

  @IsString()
  @IsOptional()
  @MaxLength(200)
  descripcion?: string;

  @IsDateString()
  @IsOptional()
  fechaVencimiento?: string;
}
