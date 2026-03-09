import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CuentasService } from './cuentas.service';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';

@UseGuards(JwtAuthGuard)
@Controller('cuentas')
export class CuentasController {
  constructor(private readonly cuentasService: CuentasService) {}

  @Get()
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query('tipo') tipo?: 'POR_COBRAR' | 'POR_PAGAR',
  ) {
    return this.cuentasService.findAll(user.idUsuario, tipo);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.cuentasService.findOne(id, user.idUsuario);
  }

  @Post()
  create(@Body() dto: CreateCuentaDto, @CurrentUser() user: JwtPayload) {
    return this.cuentasService.create(dto, user.idUsuario);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCuentaDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.cuentasService.update(id, dto, user.idUsuario);
  }
}
