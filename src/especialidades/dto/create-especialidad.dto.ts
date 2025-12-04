import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEspecialidadDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser un string' })
  @MaxLength(100, {
    message: 'El campo nombre debe tener un máximo de 100 caracteres',
  })
  readonly nombre: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'El campo descripcion debe ser un string' })
  readonly descripcion?: string;
}
