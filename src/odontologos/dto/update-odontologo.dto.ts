import { PartialType } from '@nestjs/mapped-types';
import { CreateOdontologoDto } from './create-odontologo.dto';

export class UpdateOdontologoDto extends PartialType(CreateOdontologoDto) {}
