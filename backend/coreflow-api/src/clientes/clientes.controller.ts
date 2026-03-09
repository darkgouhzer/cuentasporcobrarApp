import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@UseGuards(JwtAuthGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.clientesService.findAll(user.idUsuario);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.clientesService.findOne(id, user.idUsuario);
  }

  @Post()
  create(@Body() dto: CreateClienteDto, @CurrentUser() user: JwtPayload) {
    return this.clientesService.create(dto, user.idUsuario);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClienteDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.clientesService.update(id, dto, user.idUsuario);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.clientesService.remove(id, user.idUsuario);
  }
}
