import { PartialType } from '@nestjs/swagger';
import { CreateHistorialMedicoDto } from './create-historial-medico.dto';

export class UpdateHistorialMedicoDto extends PartialType(CreateHistorialMedicoDto) {}
