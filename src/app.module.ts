import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TratamientosModule } from './tratamientos/tratamientos.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { OdontologosModule } from './odontologos/odontologos.module';
import { CitasModule } from './citas/citas.module';
import { RolesModule } from './roles/roles.module';
import { OdontologoTratamientosModule } from './odontologo_tratamientos/odontologo_tratamientos.module';
import { HorariosModule } from './horarios/horarios.module';
import { AuthModule } from './auth/auth.module';
import { FeriadosModule } from './feriados/feriados.module';
import { HistorialMedicoModule } from './historial-medico/historial-medico.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { EspecialidadesModule } from './especialidades/especialidades.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '*/**/entities/*.{ts|js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    CitasModule,
    TratamientosModule,
    PacientesModule,
    OdontologosModule,
    EspecialidadesModule,
    RolesModule,
    OdontologoTratamientosModule,
    HorariosModule,
    AuthModule,
    FeriadosModule,
    HistorialMedicoModule,
    ConfiguracionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
