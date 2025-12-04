import { PartialType } from '@nestjs/swagger';
import { CreateOdontologoTratamientoDto } from './create-odontologo_tratamiento.dto';

export class UpdateOdontologoTratamientoDto extends PartialType(CreateOdontologoTratamientoDto) {}
