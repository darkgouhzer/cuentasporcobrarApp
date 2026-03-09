import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';

@Injectable()
export class CuentasService {
  constructor(private readonly prisma: PrismaService) {}

  private async verificarPropietario(idCuenta: number, idUsuario: number) {
    const cuenta = await this.prisma.cuentas.findFirst({
      where: {
        idCuenta,
        clientes: { idUsuario },
      },
      include: { clientes: true },
    });
    if (!cuenta) throw new NotFoundException('Cuenta no encontrada');
    return cuenta;
  }

  async findAll(idUsuario: number, tipo?: 'POR_COBRAR' | 'POR_PAGAR') {
    const cuentas = await this.prisma.cuentas.findMany({
      where: {
        clientes: { idUsuario },
        ...(tipo && { tipo }),
      },
      include: {
        clientes: {
          select: {
            idCliente: true,
            nombre: true,
            apellidoPaterno: true,
            apellidoMaterno: true,
          },
        },
      },
      orderBy: { fechaEmision: 'desc' },
    });
    return { data: cuentas, message: 'Cuentas obtenidas', statusCode: 200 };
  }

  async findOne(idCuenta: number, idUsuario: number) {
    const cuenta = await this.verificarPropietario(idCuenta, idUsuario);
    return { data: cuenta, message: 'Cuenta obtenida', statusCode: 200 };
  }

  async create(dto: CreateCuentaDto, idUsuario: number) {
    // Verificar que el cliente pertenece al usuario
    const cliente = await this.prisma.clientes.findFirst({
      where: { idCliente: dto.idCliente, idUsuario },
    });
    if (!cliente) throw new ForbiddenException('Cliente no encontrado o no autorizado');

    const cuenta = await this.prisma.cuentas.create({
      data: {
        idCliente: dto.idCliente,
        tipo: dto.tipo,
        descripcion: dto.descripcion,
        fechaVencimiento: dto.fechaVencimiento ? new Date(dto.fechaVencimiento) : null,
      },
    });
    return { data: cuenta, message: 'Cuenta creada', statusCode: 201 };
  }

  async update(idCuenta: number, dto: UpdateCuentaDto, idUsuario: number) {
    await this.verificarPropietario(idCuenta, idUsuario);
    const cuenta = await this.prisma.cuentas.update({
      where: { idCuenta },
      data: {
        ...(dto.descripcion !== undefined && { descripcion: dto.descripcion }),
        ...(dto.estado && { estado: dto.estado }),
        ...(dto.fechaVencimiento && { fechaVencimiento: new Date(dto.fechaVencimiento) }),
      },
    });
    return { data: cuenta, message: 'Cuenta actualizada', statusCode: 200 };
  }
}
