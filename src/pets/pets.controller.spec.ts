import { Test, TestingModule } from '@nestjs/testing';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { JwtStrategy } from 'src/users/JWT/jwt.strategy';
import { JwtAuthGuard } from 'src/users/JWT/jwt-auth.guards';
import { UsersModule } from 'src/users/users.module';

describe('PetsController', () => {
  let controller: PetsController;

  const mockPetsService ={

  }

  const mockJwtAuthGuard = {

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
    imports: [UsersModule],
    controllers: [PetsController],
     providers: [
      {
        provide: JwtStrategy,
        useValue: mockJwtAuthGuard,
      },
      {
        provide: PetsService,
        useValue: mockPetsService,
      },
      {
        provide: JwtAuthGuard,
        useValue: mockJwtAuthGuard
      },

     ]
    })
    // .overrideProvider(PetsService)
    // .useValue(mockPetsService)
    .compile();

    controller = module.get<PetsController>(PetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
