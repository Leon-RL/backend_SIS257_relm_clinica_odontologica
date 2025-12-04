import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private pacientesRepository: Repository<Paciente>,
  ) {}

  async create(createPacienteDto: CreatePacienteDto): Promise<Paciente> {
    // Validar email duplicado (case-insensitive)
    const emailRepetido = await this.pacientesRepository
      .createQueryBuilder('paciente')
      .where('LOWER(paciente.email) = LOWER(:email)', {
        email: createPacienteDto.email.trim(),
      })
      .andWhere('paciente.fecha_eliminacion IS NULL')
      .getOne();

    if (emailRepetido) {
      throw new ConflictException('El email ya existe');
    }

    // Validar nombre y apellidos duplicados (case-insensitive)
    const nombreRepetido = await this.pacientesRepository
      .createQueryBuilder('paciente')
      .where('LOWER(TRIM(paciente.nombre)) = LOWER(TRIM(:nombre))', {
        nombre: createPacienteDto.nombre,
      })
      .andWhere('LOWER(TRIM(paciente.primer_apellido)) = LOWER(TRIM(:primerApellido))', {
        primerApellido: createPacienteDto.primerApellido,
      })
      .andWhere('LOWER(TRIM(paciente.segundo_apellido)) = LOWER(TRIM(:segundoApellido))', {
        segundoApellido: createPacienteDto.segundoApellido,
      })
      .andWhere('paciente.fecha_eliminacion IS NULL')
      .getOne();

    console.log('Buscando duplicado con:', {
      nombre: createPacienteDto.nombre,
      primerApellido: createPacienteDto.primerApellido,
      segundoApellido: createPacienteDto.segundoApellido,
      encontrado: !!nombreRepetido,
    });

    if (nombreRepetido) {
      throw new ConflictException('Ya existe un paciente con ese nombre y apellidos');
    }

    const paciente = new Paciente();
    paciente.nombre = createPacienteDto.nombre.trim();
    paciente.primerApellido = createPacienteDto.primerApellido.trim();
    paciente.segundoApellido = createPacienteDto.segundoApellido.trim();
    paciente.email = createPacienteDto.email.trim();
    // Usar trim() para evitar espacios en blanco heredados desde .env
    paciente.password = process.env.DEFAULT_PASSWORD?.trim() ?? '';
    paciente.telefono = createPacienteDto.telefono.trim();
    paciente.direccion = createPacienteDto.direccion.trim();

    return this.pacientesRepository.save(paciente);
  }

  async findAll(): Promise<Paciente[]> {
    return this.pacientesRepository.find({
      relations: ['rol'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Paciente> {
    const paciente = await this.pacientesRepository.findOneBy({ id });
    if (!paciente) {
      throw new ConflictException('El cliente no existe');
    }
    return paciente;
  }

  async findAuthenticatedUser(id: number): Promise<Paciente> {
    // Reutilizamos findOne para obtener al cliente autenticado
    return this.findOne(id);
  }

  async update(id: number, updatePacienteDto: UpdatePacienteDto): Promise<Paciente> {
    const Paciente = await this.findOne(id);

    // Si se actualiza el email, validar que no esté duplicado
    if (updatePacienteDto.email) {
      const emailRepetido = await this.pacientesRepository
        .createQueryBuilder('paciente')
        .where('LOWER(paciente.email) = LOWER(:email)', {
          email: updatePacienteDto.email.trim(),
        })
        .andWhere('paciente.id != :id', { id })
        .andWhere('paciente.fecha_eliminacion IS NULL')
        .getOne();

      if (emailRepetido) {
        throw new ConflictException('El email ya existe');
      }
    }

    // Si se actualizan nombre y apellidos, validar que no estén duplicados
    if (
      updatePacienteDto.nombre ||
      updatePacienteDto.primerApellido ||
      updatePacienteDto.segundoApellido
    ) {
      const nombreRepetido = await this.pacientesRepository
        .createQueryBuilder('paciente')
        .where('LOWER(TRIM(paciente.nombre)) = LOWER(TRIM(:nombre))', {
          nombre: updatePacienteDto.nombre || Paciente.nombre,
        })
        .andWhere('LOWER(TRIM(paciente.primer_apellido)) = LOWER(TRIM(:primerApellido))', {
          primerApellido: updatePacienteDto.primerApellido || Paciente.primerApellido,
        })
        .andWhere('LOWER(TRIM(paciente.segundo_apellido)) = LOWER(TRIM(:segundoApellido))', {
          segundoApellido: updatePacienteDto.segundoApellido || Paciente.segundoApellido,
        })
        .andWhere('paciente.id != :id', { id })
        .andWhere('paciente.fecha_eliminacion IS NULL')
        .getOne();

      if (nombreRepetido) {
        throw new ConflictException('Ya existe un paciente con ese nombre y apellidos');
      }
    }

    const pacienteUpdate = Object.assign(Paciente, updatePacienteDto);
    return this.pacientesRepository.save(pacienteUpdate);
  }

  async remove(id: number) {
    const paciente = await this.findOne(id);
    return this.pacientesRepository.softRemove(paciente);
  }

  async validate(email: string, clave: string): Promise<Paciente | null> {
    const emailOk = await this.pacientesRepository.findOne({
      where: { email },
      select: ['id', 'nombre', 'email', 'password'], // Campos seleccionados
      relations: ['rol'], // Incluye la relación con el rol
    });

    if (!emailOk) {
      return null; // Retorna null si no encuentra el cliente
    }

    // Validamos la contraseña
    const isPasswordValid = await emailOk.validatePassword(clave);
    if (!isPasswordValid) {
      return null; // Retorna null si la contraseña no es válida
    }

    return emailOk; // Devuelve el cliente con el rol cargado
  }

  async cambiarPassword(
    userId: number,
    passwordActual: string,
    nuevaPassword: string,
  ): Promise<string> {
    // 1. Buscar al cliente por ID
    const cliente = await this.findOne(userId);
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado.');
    }

    // 2. Validar la contraseña actual
    const isPasswordValid = await cliente.validatePassword(passwordActual);
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.');
    }

    // 3. Actualizar la contraseña
    cliente.password = nuevaPassword; // Asignar la nueva contraseña
    await this.pacientesRepository.save(cliente); // Guardar cambios (se hashea automáticamente en `hashPassword`)

    return 'La contraseña ha sido actualizada correctamente.';
  }
}
