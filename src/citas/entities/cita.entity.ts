import { Odontologo } from 'src/odontologos/entities/odontologo.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Tratamiento } from 'src/tratamientos/entities/tratamiento.entity';

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

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  estado: string;

  @Column('integer', { name: 'cliente_id' })
  clienteId: number;

  @Column('integer', { name: 'odontologo_id' })
  odontologoId: number;

  @Column('integer', { name: 'servicio_id' })
  servicioId: number;

  // Agregado para manejar un rango de tiempo
  @Column('timestamp', { name: 'fecha_hora_inicio' })
  fechaHoraInicio: Date;

  @Column('timestamp', { name: 'fecha_hora_fin' })
  fechaHoraFin: Date;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;

  @ManyToOne(() => Paciente, paciente => paciente.citas)
  // La columna en la tabla se llama 'cliente_id'
  @JoinColumn({ name: 'cliente_id', referencedColumnName: 'id' })
  paciente: Paciente;

  @ManyToOne(() => Odontologo, odontologo => odontologo.citas)
  @JoinColumn({ name: 'odontologo_id', referencedColumnName: 'id' })
  odontologo: Odontologo;

  @ManyToOne(() => Tratamiento, tratamiento => tratamiento.citas)
  // La columna en la tabla se llama 'servicio_id'
  @JoinColumn({ name: 'servicio_id', referencedColumnName: 'id' })
  tratamiento: Tratamiento;
}
