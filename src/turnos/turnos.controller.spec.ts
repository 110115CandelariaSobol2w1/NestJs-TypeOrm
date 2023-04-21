import { Test, TestingModule } from '@nestjs/testing';
import { TurnosController } from './turnos.controller';
import { TurnosService } from './turnos.service';

describe('TurnosController', () => {
  let controller: TurnosController;

  const mockTurnosService = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TurnosController],
      providers: [
        {
          provide: TurnosService,
          useValue: mockTurnosService
        }
      ]
    }).compile();

    controller = module.get<TurnosController>(TurnosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
