import { Cita } from 'src/citas/entities/cita.entity';
import { OdontologoTratamiento } from 'src/odontologo_tratamientos/entities/odontologo_tratamiento.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tratamientos')
export class Tratamiento {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', { length: 100 })
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column('integer', { name: 'duracion' })
  duracion: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;

  @OneToMany(() => Cita, cita => cita.tratamiento)
  citas: Cita[];

  @OneToMany(() => OdontologoTratamiento, odontologo_servicio => odontologo_servicio.tratamiento)
  odontologo_servicios: OdontologoTratamiento[];
}
