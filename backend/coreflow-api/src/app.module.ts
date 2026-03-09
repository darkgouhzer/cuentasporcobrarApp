import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { ConceptosModule } from './conceptos/conceptos.module';
import { CuentasModule } from './cuentas/cuentas.module';
import { CuentaDetalleModule } from './cuenta-detalle/cuenta-detalle.module';
import { MovimientosModule } from './movimientos/movimientos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ClientesModule,
    ConceptosModule,
    CuentasModule,
    CuentaDetalleModule,
    MovimientosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
