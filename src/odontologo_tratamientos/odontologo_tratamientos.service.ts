import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOdontologoTratamientoDto } from './dto/create-odontologo_tratamiento.dto';
import { UpdateOdontologoTratamientoDto } from './dto/update-odontologo_tratamiento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OdontologoTratamiento } from './entities/odontologo_tratamiento.entity';
import { In, Not, Repository } from 'typeorm';
import { Odontologo } from 'src/odontologos/entities/odontologo.entity';
import { Tratamiento } from 'src/tratamientos/entities/tratamiento.entity';

@Injectable()
export class OdontologoTratamientosService {
  constructor(
    @InjectRepository(OdontologoTratamiento)
    private odontologoTratamientoRepository: Repository<OdontologoTratamiento>,
    @InjectRepository(Odontologo)
    private odontologoRepository: Repository<Odontologo>,
    @InjectRepository(Tratamiento)
    private tratamientoRepository: Repository<Tratamiento>,
  ) {}

  async create(
    createOdontologoTratamientoDto: CreateOdontologoTratamientoDto,
  ): Promise<OdontologoTratamiento> {
    const { odontologoId, tratamientoId } = createOdontologoTratamientoDto;

    // Verificar si el odontólogo existe
    const odontologoExistente = await this.odontologoRepository.findOneBy({
      id: odontologoId,
    });
    if (!odontologoExistente) {
      throw new NotFoundException(`El odontólogo con ID ${odontologoId} no existe`);
    }

    // Verificar si el servicio existe
    const tratamientoExistente = await this.tratamientoRepository.findOneBy({
      id: tratamientoId,
    });
    if (!tratamientoExistente) {
      throw new NotFoundException(`El servicio con ID ${tratamientoId} no existe`);
    }

    const existe = await this.odontologoTratamientoRepository.findOne({
      where: { odontologoId: odontologoId, tratamientoId: tratamientoId },
    });
    if (existe)
      throw new ConflictException(
        `El odontólogo ya está asociado con el servicio de nombre ${tratamientoExistente.nombre} se agrego los no repetidos. Gracias`,
      );

    const odontologoTratamiento = new OdontologoTratamiento();
    odontologoTratamiento.odontologoId = createOdontologoTratamientoDto.odontologoId;
    odontologoTratamiento.tratamientoId = createOdontologoTratamientoDto.tratamientoId;
    return this.odontologoTratamientoRepository.save(odontologoTratamiento);
  }

  async findAll(): Promise<OdontologoTratamiento[]> {
    return this.odontologoTratamientoRepository.find({
      relations: ['odontologo', 'servicio'],
    });
  }

  async findOne(id: number): Promise<OdontologoTratamiento> {
    if (isNaN(id)) {
      throw new BadRequestException('El id proporcionado no es válido');
    }

    try {
      const odontologoTratamiento = await this.odontologoTratamientoRepository.findOneOrFail({
        where: { id },
        relations: ['odontologo', 'servicio'],
      });
      return odontologoTratamiento;
    } catch (error) {
      throw new ConflictException('El odontólogo no está asociado con este servicio');
    }
  }

  async update(
    id: number,
    updateOdontologoTratamientoDto: UpdateOdontologoTratamientoDto,
  ): Promise<OdontologoTratamiento> {
    const odontologoTratamiento = await this.odontologoTratamientoRepository.findOneBy({ id });

    if (!odontologoTratamiento) {
      throw new NotFoundException('La relación no existe para este odontólogo y servicio');
    }

    // Actualizar el servicioId
    if (updateOdontologoTratamientoDto.tratamientoId !== undefined) {
      odontologoTratamiento.tratamientoId = updateOdontologoTratamientoDto.tratamientoId;
    }

    // Guardar los cambios
    return this.odontologoTratamientoRepository.save(odontologoTratamiento);
  }

  async remove(id: number): Promise<OdontologoTratamiento> {
    const odontologoTratamiento = await this.odontologoTratamientoRepository.findOneBy({ id });
    if (!odontologoTratamiento)
      throw new ConflictException('El odontólogo no está asociado con este servicio');
    return this.odontologoTratamientoRepository.softRemove(odontologoTratamiento);
  }

  async eliminarRelacion(odontologoId: number, tratamientoId: number): Promise<boolean> {
    console.log('Intentando eliminar relación:', { odontologoId, servicioId: tratamientoId });

    try {
      // Buscar la relación
      const relacion = await this.odontologoTratamientoRepository.findOne({
        where: { odontologoId, tratamientoId: tratamientoId },
      });

      if (!relacion) {
        console.error('Relación no encontrada en la base de datos');
        return false;
      }

      // Eliminar la relación
      await this.odontologoTratamientoRepository.remove(relacion);
      return true;
    } catch (error) {
      return false;
    }
  }

  async findByOdontologoId(odontologoId: number): Promise<any> {
    const odontologoServicios = await this.odontologoTratamientoRepository.find({
      where: { odontologoId },
      relations: ['tratamiento'], // Solo necesitamos los servicios relacionados
    });

    // Devuelve un array vacío si no hay servicios
    return odontologoServicios.map(item => ({
      id: item.tratamiento.id,
      nombre: item.tratamiento.nombre,
      descripcion: item.tratamiento.descripcion,
      precio: item.tratamiento.precio,
      duracion: item.tratamiento.duracion,
    }));
  }

  // Devuelve las relaciones completas (útil para formularios que esperan "tratamientoId")
  async findRelationsByOdontologoId(odontologoId: number): Promise<OdontologoTratamiento[]> {
    const relaciones = await this.odontologoTratamientoRepository.find({
      where: { odontologoId },
      relations: ['tratamiento'],
    });
    return relaciones;
  }
}
