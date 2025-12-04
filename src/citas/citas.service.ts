import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private citasRepository: Repository<Cita>,
  ) {}

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    const cita = this.citasRepository.create(createCitaDto);
    return this.citasRepository.save(cita);
  }

  findAll(): Promise<Cita[]> {
    // Incluir relaciones y ordenar por id descendente
    return this.citasRepository.find({
      relations: ['paciente', 'odontologo', 'tratamiento'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Cita> {
    const cita = await this.citasRepository.findOne({
      where: { id },
      relations: ['paciente', 'odontologo', 'tratamiento'],
    });
    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada.`);
    }
    return cita;
  }

  async update(id: number, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    const cita = await this.findOne(id);
    this.citasRepository.merge(cita, updateCitaDto);
    return this.citasRepository.save(cita);
  }

  async remove(id: number): Promise<void> {
    const result = await this.citasRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada para eliminar.`);
    }
  }
}
