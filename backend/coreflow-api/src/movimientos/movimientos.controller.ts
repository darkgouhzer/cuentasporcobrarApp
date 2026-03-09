import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';

@UseGuards(JwtAuthGuard)
@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @Get('cuenta/:idCuenta')
  findByCuenta(
    @Param('idCuenta', ParseIntPipe) idCuenta: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.movimientosService.findByCuenta(idCuenta, user.idUsuario);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.movimientosService.findOne(id, user.idUsuario);
  }

  @Post()
  create(@Body() dto: CreateMovimientoDto, @CurrentUser() user: JwtPayload) {
    return this.movimientosService.create(dto, user.idUsuario);
  }
}
