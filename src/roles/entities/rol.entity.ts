import { Odontologo } from 'src/odontologos/entities/odontologo.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 25 })
  nombre: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;

  @OneToMany(() => Paciente, paciente => paciente.rol)
  pacientes: Paciente[];

  @OneToMany(() => Odontologo, odontologo => odontologo.rol)
  odontologos: Odontologo[];
}
