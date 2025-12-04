import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialMedicoService } from './historial-medico.service';
import { HistorialMedicoController } from './historial-medico.controller';
import { HistorialMedico } from './entities/historial-medico.entity'; // ⬅️ Importar la entidad

@Module({
  imports: [TypeOrmModule.forFeature([HistorialMedico])], // ✅ Registrar la entidad
  controllers: [HistorialMedicoController],
  providers: [HistorialMedicoService],
  exports: [TypeOrmModule],
})
export class HistorialMedicoModule {}