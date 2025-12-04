import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { OdontologosService } from './odontologos.service';
import { CreateOdontologoDto } from './dto/create-odontologo.dto';
import { UpdateOdontologoDto } from './dto/update-odontologo.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

//@ApiBearerAuth()
@ApiTags('Odontólogos')
@Controller('odontologos')
export class OdontologosController {
  constructor(private readonly odontologosService: OdontologosService) {}

  @Get('mi-perfil')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAuthenticatedUser(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.id; // Extrae el ID del usuario autenticado desde el token
    return await this.odontologosService.findAuthenticatedUser(Number(userId)); // Retorna el odontologo autenticado
  }

  @Post('cambiar-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async cambiarPassword(
    @Req() req: any,
    @Body() body: { passwordActual: string; nuevaPassword: string },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user.id;
    const { passwordActual, nuevaPassword } = body;

    if (!passwordActual || !nuevaPassword) {
      throw new BadRequestException('Ambas contraseñas son obligatorias.');
    }

    return await this.odontologosService.cambiarPassword(userId, passwordActual, nuevaPassword);
  }

  @Post()
  create(@Body() createOdontologoDto: CreateOdontologoDto) {
    return this.odontologosService.create(createOdontologoDto);
  }

  // Método público: No tiene @ApiBearerAuth ni @UseGuards
  @Get()
  findAll() {
    return this.odontologosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.odontologosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOdontologoDto: UpdateOdontologoDto) {
    return this.odontologosService.update(+id, updateOdontologoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.odontologosService.remove(+id);
  }
}
