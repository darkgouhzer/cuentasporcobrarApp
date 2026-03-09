import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(idUsuario: number) {
    const clientes = await this.prisma.clientes.findMany({
      where: { idUsuario, activo: true },
      orderBy: { nombre: 'asc' },
    });
    return { data: clientes, message: 'Clientes obtenidos', statusCode: 200 };
  }

  async findOne(idCliente: number, idUsuario: number) {
    const cliente = await this.prisma.clientes.findFirst({
      where: { idCliente, idUsuario },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return { data: cliente, message: 'Cliente obtenido', statusCode: 200 };
  }

  async create(dto: CreateClienteDto, idUsuario: number) {
    const cliente = await this.prisma.clientes.create({
      data: { ...dto, idUsuario },
    });
    return { data: cliente, message: 'Cliente creado', statusCode: 201 };
  }

  async update(idCliente: number, dto: UpdateClienteDto, idUsuario: number) {
    await this.findOne(idCliente, idUsuario);
    const cliente = await this.prisma.clientes.update({
      where: { idCliente },
      data: dto,
    });
    return { data: cliente, message: 'Cliente actualizado', statusCode: 200 };
  }

  async remove(idCliente: number, idUsuario: number) {
    await this.findOne(idCliente, idUsuario);
    await this.prisma.clientes.update({
      where: { idCliente },
      data: { activo: false },
    });
    return { data: null, message: 'Cliente eliminado', statusCode: 200 };
  }
}
