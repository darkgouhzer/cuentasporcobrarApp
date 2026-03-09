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

export class CreateDetalleDto {
  @IsInt()
  @IsNotEmpty()
  idCuenta: number;

  @IsInt()
  @IsOptional()
  idConcepto?: number;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  descripcion?: string;

  @IsEnum(['PRODUCTO', 'SERVICIO', 'HORA_TRABAJO', 'OTRO'])
  tipoConcepto: 'PRODUCTO' | 'SERVICIO' | 'HORA_TRABAJO' | 'OTRO';

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Type(() => Number)
  cantidad: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  precioUnitario: number;
}
