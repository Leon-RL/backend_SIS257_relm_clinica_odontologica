import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOdontologoDto } from './dto/create-odontologo.dto';
import { UpdateOdontologoDto } from './dto/update-odontologo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Odontologo } from './entities/odontologo.entity';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OdontologosService {
  constructor(
    @InjectRepository(Odontologo)
    private odontologosRepository: Repository<Odontologo>,
    @InjectRepository(Especialidad)
    private especialidadesRepository: Repository<Especialidad>,
  ) {}

  async create(createOdontologoDto: CreateOdontologoDto): Promise<Odontologo> {
    // Validar email duplicado (case-insensitive)
    const emailRepetido = await this.odontologosRepository
      .createQueryBuilder('odontologo')
      .where('LOWER(odontologo.email) = LOWER(:email)', {
        email: createOdontologoDto.email.trim(),
      })
      .andWhere('odontologo.fecha_eliminacion IS NULL')
      .getOne();

    if (emailRepetido) throw new ConflictException('El odontólogo con ese email ya existe');

    // Validar nombre y apellidos duplicados (case-insensitive)
    const nombreRepetido = await this.odontologosRepository
      .createQueryBuilder('odontologo')
      .where('LOWER(TRIM(odontologo.nombre)) = LOWER(TRIM(:nombre))', {
        nombre: createOdontologoDto.nombre,
      })
      .andWhere('LOWER(TRIM(odontologo.primer_apellido)) = LOWER(TRIM(:primerApellido))', {
        primerApellido: createOdontologoDto.primerApellido,
      })
      .andWhere('LOWER(TRIM(odontologo.segundo_apellido)) = LOWER(TRIM(:segundoApellido))', {
        segundoApellido: createOdontologoDto.segundoApellido,
      })
      .andWhere('odontologo.fecha_eliminacion IS NULL')
      .getOne();

    if (nombreRepetido) {
      throw new ConflictException('Ya existe un odontólogo con ese nombre y apellidos');
    }

    const odontologo = new Odontologo();
    odontologo.nombre = createOdontologoDto.nombre.trim();
    odontologo.primerApellido = createOdontologoDto.primerApellido.trim();
    odontologo.segundoApellido = createOdontologoDto.segundoApellido.trim();
    odontologo.email = createOdontologoDto.email.trim();
    // Usar trim() para evitar espacios en blanco heredados desde .env
    odontologo.password = createOdontologoDto.password.trim();
    odontologo.telefono = createOdontologoDto.telefono.trim();
    odontologo.direccion = createOdontologoDto.direccion.trim();
    // Asignar imagen si se envía
    if ((createOdontologoDto as any).imagen) {
      odontologo.imagen = (createOdontologoDto as any).imagen.trim();
    }

    // Resolver la especialidad por ID y asignarla como relación
    const especialidadId = (createOdontologoDto as any).especialidadId;
    if (especialidadId) {
      const especialidad = await this.especialidadesRepository.findOneBy({ id: especialidadId });
      if (!especialidad) {
        throw new NotFoundException('La especialidad indicada no existe');
      }
      odontologo.especialidad = especialidad;
    }

    return this.odontologosRepository.save(odontologo);
  }

  async findAll(): Promise<Odontologo[]> {
    return this.odontologosRepository.find({
      relations: ['rol', 'especialidad'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Odontologo> {
    const odontologo = await this.odontologosRepository.findOne({
      where: { id },
      relations: ['rol', 'especialidad'],
    });
    if (!odontologo) throw new NotFoundException('El odontologo no existe');

    return odontologo;
  }

  async findAuthenticatedUser(id: number): Promise<Odontologo> {
    // Reutilizamos findOne para obtener al odontologo autenticado
    return this.findOne(id);
  }

  async update(id: number, updateOdontologoDto: UpdateOdontologoDto): Promise<Odontologo> {
    const Odontologo = await this.findOne(id);

    // Si se actualiza el email, validar que no esté duplicado
    if (updateOdontologoDto.email) {
      const emailRepetido = await this.odontologosRepository
        .createQueryBuilder('odontologo')
        .where('LOWER(odontologo.email) = LOWER(:email)', {
          email: updateOdontologoDto.email.trim(),
        })
        .andWhere('odontologo.id != :id', { id })
        .andWhere('odontologo.fecha_eliminacion IS NULL')
        .getOne();

      if (emailRepetido) {
        throw new ConflictException('El odontólogo con ese email ya existe');
      }
    }

    // Si se actualizan nombre y apellidos, validar que no estén duplicados
    // Solo validar si al menos uno de los campos realmente cambió
    const nombreCambio =
      updateOdontologoDto.nombre &&
      updateOdontologoDto.nombre.trim().toLowerCase() !== Odontologo.nombre.trim().toLowerCase();
    const primerApellidoCambio =
      updateOdontologoDto.primerApellido &&
      updateOdontologoDto.primerApellido.trim().toLowerCase() !==
        Odontologo.primerApellido.trim().toLowerCase();
    const segundoApellidoCambio =
      updateOdontologoDto.segundoApellido &&
      updateOdontologoDto.segundoApellido.trim().toLowerCase() !==
        Odontologo.segundoApellido.trim().toLowerCase();

    if (nombreCambio || primerApellidoCambio || segundoApellidoCambio) {
      const nombreRepetido = await this.odontologosRepository
        .createQueryBuilder('odontologo')
        .where('LOWER(TRIM(odontologo.nombre)) = LOWER(TRIM(:nombre))', {
          nombre: updateOdontologoDto.nombre || Odontologo.nombre,
        })
        .andWhere('LOWER(TRIM(odontologo.primer_apellido)) = LOWER(TRIM(:primerApellido))', {
          primerApellido: updateOdontologoDto.primerApellido || Odontologo.primerApellido,
        })
        .andWhere('LOWER(TRIM(odontologo.segundo_apellido)) = LOWER(TRIM(:segundoApellido))', {
          segundoApellido: updateOdontologoDto.segundoApellido || Odontologo.segundoApellido,
        })
        .andWhere('odontologo.id != :id', { id })
        .andWhere('odontologo.fecha_eliminacion IS NULL')
        .getOne();

      if (nombreRepetido) {
        throw new ConflictException('Ya existe un odontólogo con ese nombre y apellidos');
      }
    }

    // Aplicar cambios simples
    const odontologoUpdate = Object.assign(Odontologo, updateOdontologoDto);

    // Si se envía imagen, asignarla (puede venir en el DTO)
    if ((updateOdontologoDto as any).imagen !== undefined) {
      odontologoUpdate.imagen = (updateOdontologoDto as any).imagen;
    }

    // Si se envía especialidadId, resolver la entidad y asignarla
    const especialidadId = (updateOdontologoDto as any).especialidadId;
    if (especialidadId !== undefined) {
      const especialidad = await this.especialidadesRepository.findOneBy({ id: especialidadId });
      if (!especialidad) throw new NotFoundException('La especialidad indicada no existe');
      odontologoUpdate.especialidad = especialidad;
    }

    return this.odontologosRepository.save(odontologoUpdate);
  }

  async remove(id: number): Promise<Odontologo> {
    const odontologo = await this.findOne(id);
    return this.odontologosRepository.softRemove(odontologo);
  }

  // aqui se valida el email y la clave
  async validate(email: string, clave: string): Promise<Odontologo | null> {
    const emailOk = await this.odontologosRepository.findOne({
      where: { email },
      select: ['id', 'nombre', 'email', 'password'], // Campos seleccionados
      relations: ['rol'], // Incluye la relación con el rol
    });

    if (!emailOk) {
      return null; // Retorna null si no encuentra el odontólogo
    }

    // Validamos la contraseña
    const isPasswordValid = await emailOk.validatePassword(clave);
    if (!isPasswordValid) {
      return null; // Retorna null si la contraseña no es válida
    }

    return emailOk; // Devuelve el odontólogo con el rol cargado
  }

  async cambiarPassword(
    userId: number,
    passwordActual: string,
    nuevaPassword: string,
  ): Promise<string> {
    // 1. Buscar al odontologo por ID
    const odontologo = await this.findOne(userId);
    if (!odontologo) {
      throw new NotFoundException('Odontologo no encontrado.');
    }

    // 2. Validar la contraseña actual
    const isPasswordValid = await odontologo.validatePassword(passwordActual);
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.');
    }

    // 3. Actualizar la contraseña
    odontologo.password = nuevaPassword; // Asignar la nueva contraseña
    await this.odontologosRepository.save(odontologo); // Guardar cambios (se hashea automáticamente en `hashPassword`)

    return 'La contraseña ha sido actualizada correctamente.';
  }
}
