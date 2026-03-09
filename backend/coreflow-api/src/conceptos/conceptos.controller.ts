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
import { ConceptosService } from './conceptos.service';
import { CreateConceptoDto } from './dto/create-concepto.dto';
import { UpdateConceptoDto } from './dto/update-concepto.dto';

@UseGuards(JwtAuthGuard)
@Controller('conceptos')
export class ConceptosController {
  constructor(private readonly conceptosService: ConceptosService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.conceptosService.findAll(user.idUsuario);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.conceptosService.findOne(id, user.idUsuario);
  }

  @Post()
  create(@Body() dto: CreateConceptoDto, @CurrentUser() user: JwtPayload) {
    return this.conceptosService.create(dto, user.idUsuario);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConceptoDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.conceptosService.update(id, dto, user.idUsuario);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.conceptosService.remove(id, user.idUsuario);
  }
}
