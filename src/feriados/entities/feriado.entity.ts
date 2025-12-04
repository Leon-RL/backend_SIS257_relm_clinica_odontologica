import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('feriados')
export class Feriado {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('date', { name: 'fecha', unique: true, nullable: false })
  fecha: Date; 

  @Column('varchar', { length: 100, nullable: false })
  nombre: string;

  @Column('boolean', { default: false, nullable: false })
  recurrente: boolean; 

  // --- Auditoría y Soft Delete ---
  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;
}