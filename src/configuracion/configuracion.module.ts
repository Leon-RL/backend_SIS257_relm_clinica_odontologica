import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionService } from './configuracion.service';
import { ConfiguracionController } from './configuracion.controller';
import { Configuracion } from './entities/configuracion.entity'; // ⬅️ Importar la entidad

@Module({
  imports: [TypeOrmModule.forFeature([Configuracion])], // ✅ Registrar la entidad
  controllers: [ConfiguracionController],
  providers: [ConfiguracionService],
  exports: [TypeOrmModule],
})
export class ConfiguracionModule {}