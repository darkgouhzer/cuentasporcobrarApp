import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCuentaDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  descripcion?: string;

  @IsEnum(['CANCELADA', 'VENCIDA'])
  @IsOptional()
  estado?: 'CANCELADA' | 'VENCIDA';

  @IsString()
  @IsOptional()
  fechaVencimiento?: string;
}
