import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';
import { Especialidad } from './entities/especialidad.entity';

@Injectable()
export class EspecialidadesService {
  constructor(
    @InjectRepository(Especialidad)
    private especialidadesRepository: Repository<Especialidad>,
  ) {}

  async create(createEspecialidadDto: CreateEspecialidadDto): Promise<Especialidad> {
    const existente = await this.especialidadesRepository.findOne({
      where: { nombre: createEspecialidadDto.nombre },
    });

    if (existente) {
      throw new ConflictException('Ya existe una especialidad con ese nombre');
    }

    const especialidad = new Especialidad();
    especialidad.nombre = createEspecialidadDto.nombre.trim();
    if (createEspecialidadDto.descripcion) {
      especialidad.descripcion = createEspecialidadDto.descripcion.trim();
    }

    return this.especialidadesRepository.save(especialidad);
  }

  async findAll(): Promise<Especialidad[]> {
    return this.especialidadesRepository.find({
      order: { nombre: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Especialidad> {
    const especialidad = await this.especialidadesRepository.findOne({
      where: { id },
    });

    if (!especialidad) {
      throw new NotFoundException('La especialidad no existe');
    }

    return especialidad;
  }

  async update(id: number, updateEspecialidadDto: UpdateEspecialidadDto): Promise<Especialidad> {
    const especialidad = await this.findOne(id);

    if (updateEspecialidadDto.nombre) {
      const existente = await this.especialidadesRepository.findOne({
        where: { nombre: updateEspecialidadDto.nombre },
      });

      if (existente && existente.id !== id) {
        throw new ConflictException('Ya existe una especialidad con ese nombre');
      }
    }

    const especialidadUpdate = Object.assign(especialidad, updateEspecialidadDto);
    return this.especialidadesRepository.save(especialidadUpdate);
  }

  async remove(id: number): Promise<Especialidad> {
    const especialidad = await this.findOne(id);
    return this.especialidadesRepository.softRemove(especialidad);
  }
}
