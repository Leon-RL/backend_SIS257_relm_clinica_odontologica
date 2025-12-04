import { Tratamiento } from 'src/tratamientos/entities/tratamiento.entity';
import { Odontologo } from 'src/odontologos/entities/odontologo.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Nombre de tabla que une odontólogos y tratamientos
@Entity('odontologos_tratamientos')
export class OdontologoTratamiento {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'odontologo_id' })
  odontologoId: number;

  @Column('integer', { name: 'servicio_id' })
  tratamientoId: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;

  @ManyToOne(() => Odontologo, odontologo => odontologo.odontologo_servicios)
  @JoinColumn({ name: 'odontologo_id', referencedColumnName: 'id' })
  odontologo: Odontologo;

  @ManyToOne(() => Tratamiento, tratamiento => tratamiento.odontologo_servicios)
  // La columna en la base de datos se llama 'servicio_id', debe coincidir con @Column arriba
  @JoinColumn({ name: 'servicio_id', referencedColumnName: 'id' })
  tratamiento: Tratamiento;
}
