import { Module } from '@nestjs/common';
import { TratamientosService } from './tratamientos.service';
import { TratamientosController } from './tratamientos.controller';
import { Tratamiento } from './entities/tratamiento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tratamiento])],
  controllers: [TratamientosController],
  providers: [TratamientosService],
})
export class TratamientosModule {}
