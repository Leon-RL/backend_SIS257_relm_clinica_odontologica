import { Test, TestingModule } from '@nestjs/testing';
import { CitasController } from './citas.controller';
import { CitasService } from './citas.service';

describe('CitasController', () => {
  let controller: CitasController;
  let service: CitasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitasController],

      providers: [
        {
          provide: CitasService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CitasController>(CitasController);
    service = module.get<CitasService>(CitasService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería llamar al método create del servicio', async () => {
    const createDto = {
      id_paciente: 1,
      id_odontologo: 1,
      id_tratamiento: 1,
      fecha: '2025-10-20',
      hora: '10:00:00',
      estado: 'Pendiente',
      motivo: 'Control de rutina',
    };

    const expectedResult = { id_cita: 1, ...createDto, fechaCreacion: new Date() };
    jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

    expect(await controller.create(createDto as any)).toEqual(expectedResult);

    expect(service.create).toHaveBeenCalledWith(createDto);
  });
});
