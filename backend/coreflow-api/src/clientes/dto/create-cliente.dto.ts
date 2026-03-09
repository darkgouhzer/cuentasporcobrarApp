import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellidoPaterno: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  apellidoMaterno?: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  telefono?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(['CLIENTE', 'PROVEEDOR', 'AMBOS'])
  tipo: 'CLIENTE' | 'PROVEEDOR' | 'AMBOS';
}
