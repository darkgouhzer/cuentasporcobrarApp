import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovimientoDto {
  @IsInt()
  @IsNotEmpty()
  idCuenta: number;

  @IsEnum(['ABONO', 'CARGO', 'AJUSTE', 'CANCELACION'])
  tipo: 'ABONO' | 'CARGO' | 'AJUSTE' | 'CANCELACION';

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Type(() => Number)
  importe: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  referencia?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  notas?: string;
}
