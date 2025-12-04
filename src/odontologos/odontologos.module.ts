import { Module } from '@nestjs/common';
import { OdontologosService } from './odontologos.service';
import { OdontologosController } from './odontologos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Odontologo } from './entities/odontologo.entity';
import { EspecialidadesModule } from 'src/especialidades/especialidades.module';

@Module({
  imports: [TypeOrmModule.forFeature([Odontologo]), EspecialidadesModule],
  controllers: [OdontologosController],
  providers: [OdontologosService],
  exports: [OdontologosService],
})
export class OdontologosModule {}
