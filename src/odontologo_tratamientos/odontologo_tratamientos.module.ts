import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OdontologoTratamientosController } from './odontologo_tratamientos.controller';
import { OdontologoTratamientosService } from './odontologo_tratamientos.service';
import { OdontologoTratamiento } from './entities/odontologo_tratamiento.entity';
import { Odontologo } from 'src/odontologos/entities/odontologo.entity';
import { Tratamiento } from 'src/tratamientos/entities/tratamiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OdontologoTratamiento, Odontologo, Tratamiento])],
  controllers: [OdontologoTratamientosController],
  providers: [OdontologoTratamientosService],
  exports: [OdontologoTratamientosService],
})
export class OdontologoTratamientosModule {}
