import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Odontologo } from '../../odontologos/entities/odontologo.entity';
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

@Entity('historiales_medicos')
export class HistorialMedico {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('text', { nullable: false })
  diagnostico: string;

  @Column('text', { name: 'tratamiento_aplicado', nullable: false })
  tratamientoAplicado: string;

  @Column('text', { nullable: true })
  observaciones: string;

  // --- Relación con Paciente (Cliente) ---
  @Column({ name: 'paciente_id', nullable: false })
  pacienteId: number;

  @ManyToOne(() => Paciente, paciente => paciente.historial) // Asume historial existe en Paciente
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  // --- Relación con Odontólogo ---
  @Column({ name: 'odontologo_id', nullable: false })
  odontologoId: number;

  @ManyToOne(() => Odontologo, odontologo => odontologo.registros) // Asume registros existe en Odontologo
  @JoinColumn({ name: 'odontologo_id' })
  odontologo: Odontologo;

  // --- Auditoría y Soft Delete ---
  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;
}
