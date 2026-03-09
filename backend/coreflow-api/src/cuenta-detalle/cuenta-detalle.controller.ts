import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CuentaDetalleService } from './cuenta-detalle.service';
import { CreateDetalleDto } from './dto/create-detalle.dto';

@UseGuards(JwtAuthGuard)
@Controller('cuenta-detalle')
export class CuentaDetalleController {
  constructor(private readonly cuentaDetalleService: CuentaDetalleService) {}

  @Get('cuenta/:idCuenta')
  findByCuenta(
    @Param('idCuenta', ParseIntPipe) idCuenta: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.cuentaDetalleService.findByCuenta(idCuenta, user.idUsuario);
  }

  @Post()
  create(@Body() dto: CreateDetalleDto, @CurrentUser() user: JwtPayload) {
    return this.cuentaDetalleService.create(dto, user.idUsuario);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.cuentaDetalleService.remove(id, user.idUsuario);
  }
}
