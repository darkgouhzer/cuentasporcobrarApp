import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConceptoDto } from './dto/create-concepto.dto';
import { UpdateConceptoDto } from './dto/update-concepto.dto';

@Injectable()
export class ConceptosService {
  constructor(private readonly prisma: PrismaService) {}

  // Retorna conceptos globales (idUsuario NULL) + los propios del usuario
  async findAll(idUsuario: number) {
    const conceptos = await this.prisma.conceptos.findMany({
      where: {
        activo: true,
        OR: [{ idUsuario: null }, { idUsuario }],
      },
      orderBy: { nombre: 'asc' },
    });
    return { data: conceptos, message: 'Conceptos obtenidos', statusCode: 200 };
  }

  async findOne(idConcepto: number, idUsuario: number) {
    const concepto = await this.prisma.conceptos.findFirst({
      where: {
        idConcepto,
        OR: [{ idUsuario: null }, { idUsuario }],
      },
    });
    if (!concepto) throw new NotFoundException('Concepto no encontrado');
    return { data: concepto, message: 'Concepto obtenido', statusCode: 200 };
  }

  async create(dto: CreateConceptoDto, idUsuario: number) {
    const concepto = await this.prisma.conceptos.create({
      data: { ...dto, idUsuario },
    });
    return { data: concepto, message: 'Concepto creado', statusCode: 201 };
  }

  async update(idConcepto: number, dto: UpdateConceptoDto, idUsuario: number) {
    const concepto = await this.prisma.conceptos.findUnique({ where: { idConcepto } });
    if (!concepto) throw new NotFoundException('Concepto no encontrado');
    // No se pueden modificar los conceptos globales del sistema
    if (concepto.idUsuario === null) {
      throw new ForbiddenException('No se pueden modificar los conceptos del sistema');
    }
    if (concepto.idUsuario !== idUsuario) {
      throw new ForbiddenException('No tienes permiso para modificar este concepto');
    }
    const actualizado = await this.prisma.conceptos.update({
      where: { idConcepto },
      data: dto,
    });
    return { data: actualizado, message: 'Concepto actualizado', statusCode: 200 };
  }

  async remove(idConcepto: number, idUsuario: number) {
    const concepto = await this.prisma.conceptos.findUnique({ where: { idConcepto } });
    if (!concepto) throw new NotFoundException('Concepto no encontrado');
    if (concepto.idUsuario === null) {
      throw new ForbiddenException('No se pueden eliminar los conceptos del sistema');
    }
    if (concepto.idUsuario !== idUsuario) {
      throw new ForbiddenException('No tienes permiso para eliminar este concepto');
    }
    await this.prisma.conceptos.update({
      where: { idConcepto },
      data: { activo: false },
    });
    return { data: null, message: 'Concepto eliminado', statusCode: 200 };
  }
}
