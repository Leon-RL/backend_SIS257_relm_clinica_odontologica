import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TratamientosService } from './tratamientos.service';
import { CreateTratamientoDto } from './dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Tratamientos')
@Controller('tratamientos')
export class TratamientosController {
  constructor(private readonly tratamientosService: TratamientosService) {}

  @Post()
  create(@Body() createTratamientoDto: CreateTratamientoDto) {
    return this.tratamientosService.create(createTratamientoDto);
  }

  @Get()
  findAll() {
    return this.tratamientosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tratamientosService.findOne(+id);
  }

  @Get('odontologo/:idOdontologo')
  findByOdontologo(@Param('idOdontologo') idOdontologo: string) {
    return this.tratamientosService.findByOdontologo(+idOdontologo);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTratamientoDto: UpdateTratamientoDto) {
    return this.tratamientosService.update(+id, updateTratamientoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tratamientosService.remove(+id);
  }
}
