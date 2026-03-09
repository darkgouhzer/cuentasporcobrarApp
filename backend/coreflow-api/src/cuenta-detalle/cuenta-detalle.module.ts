import { Module } from '@nestjs/common';
import { CuentaDetalleController } from './cuenta-detalle.controller';
import { CuentaDetalleService } from './cuenta-detalle.service';

@Module({
  controllers: [CuentaDetalleController],
  providers: [CuentaDetalleService],
})
export class CuentaDetalleModule {}
