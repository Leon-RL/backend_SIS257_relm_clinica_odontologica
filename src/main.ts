import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API Clínica Odontológica')
    .setDescription(
      'API para la gestión de pacientes, odontólogos, tratamientos y citas en la clínica odontológica',
    )
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Roles')
    .addTag('Pacientes')
    .addTag('Odontólogos')
    .addTag('Especialidades')
    .addTag('Tratamientos')
    .addTag('Citas')
    .addTag('Horarios')
    .addTag('Feriados')
    .addTag('Historiales_Médicos')
    .addTag('Odontólogo_Tratamientos')
    .addTag('Configuraciónes')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, documentFactory);

  await app.listen(process.env.PORT ?? 0);
  console.log(`App corriendo en ${await app.getUrl()}`);
}
bootstrap();
