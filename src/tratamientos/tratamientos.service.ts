import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTratamientoDto } from './dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tratamiento } from './entities/tratamiento.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TratamientosService {
  constructor(
    @InjectRepository(Tratamiento)
    private tratamientosRepository: Repository<Tratamiento>,
  ) {}

  async create(createTratamientoDto: CreateTratamientoDto): Promise<Tratamiento> {
    const buscarRepetidos = await this.tratamientosRepository.findOne({
      where: {
        nombre: createTratamientoDto.nombre,
      },
    });

    if (buscarRepetidos) throw new ConflictException('El servicio con ese nombre ya existe');

    const tratamiento = new Tratamiento();
    tratamiento.nombre = createTratamientoDto.nombre.trim();
    tratamiento.descripcion = createTratamientoDto.descripcion.trim();
    tratamiento.precio = createTratamientoDto.precio;
    tratamiento.duracion = createTratamientoDto.duracion;

    return this.tratamientosRepository.save(tratamiento);
  }

  async findAll(): Promise<Tratamiento[]> {
    return this.tratamientosRepository.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Tratamiento> {
    const tratamiento = await this.tratamientosRepository.findOneBy({ id });
    if (!tratamiento) throw new ConflictException('El servicio no existe');

    return tratamiento;
  }

  async findByOdontologo(idOdontologo: number): Promise<Tratamiento[]> {
    // Corregir alias: usar 'tratamiento' como alias raíz y navegar su relación 'odontologo_servicios'
    return this.tratamientosRepository
      .createQueryBuilder('tratamiento')
      .innerJoin('tratamiento.odontologo_servicios', 'odontologo_servicios')
      .innerJoin('odontologo_servicios.odontologo', 'odontologo')
      .where('odontologo.id = :idOdontologo', { idOdontologo })
      .getMany();
  }

  async update(id: number, updateTratamientoDto: UpdateTratamientoDto): Promise<Tratamiento> {
    const tratamiento = await this.findOne(id);
    const tratamientoUpdate = Object.assign(tratamiento, updateTratamientoDto);
    return this.tratamientosRepository.save(tratamientoUpdate);
  }

  async remove(id: number): Promise<Tratamiento> {
    const tratamiento = await this.findOne(id);
    return this.tratamientosRepository.softRemove(tratamiento);
  }
}
