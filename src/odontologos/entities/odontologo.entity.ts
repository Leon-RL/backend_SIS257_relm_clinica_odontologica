import { Cita } from 'src/citas/entities/cita.entity';
import { Horario } from 'src/horarios/entities/horario.entity';
import { OdontologoTratamiento } from 'src/odontologo_tratamientos/entities/odontologo_tratamiento.entity';
import { Rol } from 'src/roles/entities/rol.entity';
import { Especialidad } from 'src/especialidades/entities/especialidad.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HistorialMedico } from 'src/historial-medico/entities/historial-medico.entity';

@Entity('odontologos')
export class Odontologo {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', { length: 50, name: 'primer_apellido' })
  primerApellido: string;

  @Column('varchar', { length: 50, name: 'segundo_apellido' })
  segundoApellido: string;

  @Column('varchar', { length: 50 })
  email: string;

  @Column('varchar', { length: 250 })
  password: string;

  @Column('varchar', { length: 15 })
  telefono: string;

  @Column('varchar', { length: 100 })
  direccion: string;

  @ManyToOne(() => Especialidad, especialidad => especialidad.odontologos, { nullable: true })
  @JoinColumn({ name: 'especialidad_id' })
  especialidad: Especialidad;

  @Column('varchar', { length: 255, nullable: true })
  imagen?: string;

  @Column('integer', { name: 'rol_id', default: 1 })
  rol_id: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;

  //Bug correcion al actualizar, ahora se puede actualizar la contraseña
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      // Solo genera el hash si la contraseña está presente y no está hasheada
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Implementación de la validación de la contraseña
  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }

  @OneToMany(() => Cita, cita => cita.odontologo)
  citas: Cita[];

  @OneToMany(() => Horario, horario => horario.odontologo)
  horarios: Horario[];

  @OneToMany(() => OdontologoTratamiento, odontologoServicio => odontologoServicio.odontologo)
  odontologo_servicios: OdontologoTratamiento[];

  @ManyToOne(() => Rol, rol => rol.odontologos)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @OneToMany(() => HistorialMedico, historial => historial.odontologo)
  registros: HistorialMedico[];
}
