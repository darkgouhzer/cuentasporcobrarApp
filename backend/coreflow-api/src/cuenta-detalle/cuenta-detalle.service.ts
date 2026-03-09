import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDetalleDto } from './dto/create-detalle.dto';

@Injectable()
export class CuentaDetalleService {
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
    const detalles = await this.prisma.cuenta_detalle.findMany({
      where: { idCuenta },
      include: {
        conceptos: { select: { idConcepto: true, nombre: true } },
      },
      orderBy: { fecha: 'asc' },
    });
    return { data: detalles, message: 'Detalles obtenidos', statusCode: 200 };
  }

  async create(dto: CreateDetalleDto, idUsuario: number) {
    await this.verificarPropietarioCuenta(dto.idCuenta, idUsuario);

    // Calcular importe: cantidad × precioUnitario (regla de negocio)
    const importe = Number((dto.cantidad * dto.precioUnitario).toFixed(2));

    const detalle = await this.prisma.cuenta_detalle.create({
      data: {
        idCuenta: dto.idCuenta,
        idConcepto: dto.idConcepto ?? null,
        descripcion: dto.descripcion ?? null,
        tipoConcepto: dto.tipoConcepto,
        cantidad: dto.cantidad,
        precioUnitario: dto.precioUnitario,
        importe,
      },
    });
    return { data: detalle, message: 'Detalle agregado', statusCode: 201 };
  }

  async remove(idDetalle: number, idUsuario: number) {
    const detalle = await this.prisma.cuenta_detalle.findUnique({
      where: { idDetalle },
      include: { cuentas: { include: { clientes: true } } },
    });
    if (!detalle) throw new NotFoundException('Detalle no encontrado');
    if (detalle.cuentas.clientes.idUsuario !== idUsuario) {
      throw new ForbiddenException('No tienes permiso para eliminar este detalle');
    }
    await this.prisma.cuenta_detalle.delete({ where: { idDetalle } });
    return { data: null, message: 'Detalle eliminado', statusCode: 200 };
  }
}
