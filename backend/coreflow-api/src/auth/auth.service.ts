import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ data: { token: string; usuario: object }; message: string; statusCode: number }> {
    const existe = await this.prisma.usuarios.findUnique({
      where: { email: dto.email },
    });

    if (existe) {
      throw new ConflictException('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const usuario = await this.prisma.usuarios.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        passwordHash,
      },
    });

    const payload: JwtPayload = {
      idUsuario: usuario.idUsuario,
      email: usuario.email,
      rol: usuario.rol,
    };

    const token = this.jwtService.sign(payload);

    return {
      data: {
        token,
        usuario: {
          idUsuario: usuario.idUsuario,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      },
      message: 'Usuario registrado exitosamente',
      statusCode: 201,
    };
  }

  async login(dto: LoginDto): Promise<{ data: { token: string; usuario: object }; message: string; statusCode: number }> {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { email: dto.email },
    });

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValida = await bcrypt.compare(dto.password, usuario.passwordHash);

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      idUsuario: usuario.idUsuario,
      email: usuario.email,
      rol: usuario.rol,
    };

    const token = this.jwtService.sign(payload);

    return {
      data: {
        token,
        usuario: {
          idUsuario: usuario.idUsuario,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      },
      message: 'Login exitoso',
      statusCode: 200,
    };
  }
}
