import {
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateConceptoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsEnum(['PRODUCTO', 'SERVICIO', 'HORA_TRABAJO', 'OTRO'])
  tipo: 'PRODUCTO' | 'SERVICIO' | 'HORA_TRABAJO' | 'OTRO';

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  precioDefault: number;
}
