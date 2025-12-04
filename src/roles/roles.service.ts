import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
  ) {}

  async create(createRoleDto: CreateRolDto): Promise<Rol> {
    const { nombre } = createRoleDto;

    if (!nombre || (nombre !== 'odontologo' && nombre !== 'paciente')) {
      throw new ConflictException(
        'El campo rol es obligatorio y debe ser "odontologo" o "paciente"',
      );
    }

    const rol = new Rol();
    rol.nombre = createRoleDto.nombre.trim();
    return this.rolesRepository.save(rol);
  }

  async findAll(): Promise<Rol[]> {
    return this.rolesRepository.find();
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolesRepository.findOneBy({ id });
    if (!rol) throw new NotFoundException('El rol no existe');
    return rol;
  }

  async update(id: number, updateRoleDto: UpdateRolDto): Promise<Rol> {
    const rol = await this.findOne(id);
    const rolUpdate = Object.assign(rol, updateRoleDto);
    return this.rolesRepository.save(rolUpdate);
  }

  async remove(id: number) {
    const rol = await this.findOne(id);
    return this.rolesRepository.softRemove(rol);
  }
}
