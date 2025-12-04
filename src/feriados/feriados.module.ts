import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeriadosService } from './feriados.service';
import { FeriadosController } from './feriados.controller';
import { Feriado } from './entities/feriado.entity'; // ⬅️ Importar la entidad

@Module({
  imports: [TypeOrmModule.forFeature([Feriado])], // ✅ Registrar la entidad
  controllers: [FeriadosController],
  providers: [FeriadosService],
  exports: [TypeOrmModule], // Opcional: para usar la entidad en otros módulos (ej. tests)
})
export class FeriadosModule {}