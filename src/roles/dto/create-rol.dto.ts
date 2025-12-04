import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRolDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser de tipo string' })
  @MaxLength(25, {
    message: 'El campo nombre debe tener una longitud máxima de 25 caracteres',
  })
  readonly nombre: string;
}
