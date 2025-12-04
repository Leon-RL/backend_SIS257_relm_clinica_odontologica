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
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('Pacientes')
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get('mi-perfil')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findAuthenticatedUser(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user?.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await this.pacientesService.findAuthenticatedUser(userId);
  }

  @Post('cambiar-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async cambiarPassword(
    @Req() req: any,
    @Body() body: { passwordActual: string; nuevaPassword: string },
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user?.id;
    const { passwordActual, nuevaPassword } = body;

    if (!passwordActual || !nuevaPassword) {
      throw new BadRequestException('Ambas contraseñas son obligatorias.');
    }

    return await this.pacientesService.cambiarPassword(userId, passwordActual, nuevaPassword);
  }

  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pacientesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.pacientesService.remove(+id);
  }
}
