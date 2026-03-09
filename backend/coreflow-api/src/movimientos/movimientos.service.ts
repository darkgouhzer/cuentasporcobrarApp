import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';

@Injectable()
export class MovimientosService {
  constructor(private readonly prisma: PrismaService) {}

  private async verificarPropietarioCuenta(idCuenta: number, idUsuario: number) {
    const cuenta = await this.prisma.cuentas.findFirst({
      where: { idCuenta, clientes: { idUsuario } },
    });
    if (!cuenta) throw new ForbiddenException('Cuenta no encontrada o no autorizada');
    return cuenta;
  }

  async findByCuenta(idCuenta: number, idUsuario: number) {
    await this.verificarPropietarioCuenta(idCuenta, idUsuario);
    const movimientos = await this.prisma.movimientos.findMany({
      where: { idCuenta },
      orderBy: { fecha: 'desc' },
    });
    return { data: movimientos, message: 'Movimientos obtenidos', statusCode: 200 };
  }

  async create(dto: CreateMovimientoDto, idUsuario: number) {
    await this.verificarPropietarioCuenta(dto.idCuenta, idUsuario);
    const movimiento = await this.prisma.movimientos.create({
      data: {
        idCuenta: dto.idCuenta,
        tipo: dto.tipo,
        importe: dto.importe,
        referencia: dto.referencia ?? null,
        notas: dto.notas ?? null,
      },
    });
    return { data: movimiento, message: 'Movimiento registrado', statusCode: 201 };
  }

  async findOne(idMovimiento: number, idUsuario: number) {
    const movimiento = await this.prisma.movimientos.findFirst({
      where: {
        idMovimiento,
        cuentas: { clientes: { idUsuario } },
      },
    });
    if (!movimiento) throw new NotFoundException('Movimiento no encontrado');
    return { data: movimiento, message: 'Movimiento obtenido', statusCode: 200 };
  }
}
