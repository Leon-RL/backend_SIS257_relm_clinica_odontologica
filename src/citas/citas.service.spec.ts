import { Test, TestingModule } from '@nestjs/testing';
import { CitasService } from './citas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';

describe('CitasService', () => {
  let service: CitasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitasService,
        {
          provide: getRepositoryToken(Cita),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CitasService>(CitasService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });
});
