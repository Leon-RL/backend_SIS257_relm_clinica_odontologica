import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OdontologoTratamientosService } from './odontologo_tratamientos.service';
import { CreateOdontologoTratamientoDto } from './dto/create-odontologo_tratamiento.dto';
import { UpdateOdontologoTratamientoDto } from './dto/update-odontologo_tratamiento.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OdontologoTratamiento } from './entities/odontologo_tratamiento.entity';

@ApiBearerAuth()
@ApiTags('Odontólogo_Tratamientos')
@Controller('odontologos_tratamientos')
export class OdontologoTratamientosController {
  constructor(private readonly odontologoTratamientosService: OdontologoTratamientosService) {}

  @Post()
  create(@Body() createOdontologoTratamientoDto: CreateOdontologoTratamientoDto) {
    return this.odontologoTratamientosService.create(createOdontologoTratamientoDto);
  }

  @Get()
  findAll() {
    return this.odontologoTratamientosService.findAll();
  }

  @Get('mis-tratamientos')
  @UseGuards(JwtAuthGuard)
  async findMisTratamientos(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const odontologoId = req.user.id; // Extraer el ID del usuario autenticado
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.odontologoTratamientosService.findByOdontologoId(odontologoId);
  }

  //   @Get('mis-tratamientos-disponibles')
  //   @UseGuards(JwtAuthGuard)
  //   async findTratamientosDisponibles(@Req() req: any) {
  //     const odontologoId = req.user.id;
  //     return this.odontologoTratamientosService.findServiciosDisponibles(odontologoId);
  //   }

  @Get('mis-tratamientos-relaciones')
  @UseGuards(JwtAuthGuard)
  async findMisTratamientosRelaciones(@Req() req: any) {
    const odontologoId = req.user.id;
    return this.odontologoTratamientosService.findRelationsByOdontologoId(odontologoId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OdontologoTratamiento> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('El id debe ser un número entero');
    }
    return this.odontologoTratamientosService.findOne(parsedId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOdontologoTratamientoDto: UpdateOdontologoTratamientoDto,
  ) {
    return this.odontologoTratamientosService.update(+id, updateOdontologoTratamientoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.odontologoTratamientosService.remove(+id);
  }

  @Delete('eliminar-relacion/:odontologoId/:servicioId')
  @UseGuards(JwtAuthGuard)
  async eliminarRelacion(
    @Param('odontologoId') odontologoId: number,
    @Param('servicioId') servicioId: number,
  ) {
    try {
      const result = await this.odontologoTratamientosService.eliminarRelacion(
        odontologoId,
        servicioId,
      );

      if (!result) {
        throw new BadRequestException('La relación no fue encontrada o ya fue eliminada');
      }

      return { message: 'Relación eliminada correctamente' };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error al eliminar la relación');
    }
  }
}
