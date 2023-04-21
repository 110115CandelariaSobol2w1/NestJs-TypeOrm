import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { JwtStrategy } from './JWT/jwt.strategy';
import { JwtAuthGuard } from './JWT/jwt-auth.guards';
import { CreateUserDto } from './DTO/create-user.dto';
import { LoginUserDto } from './DTO/login-user.dto';
import { UsersModule } from './users.module';
import { user } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;


  //Mock para simular el userService y simulamos el comportamiento de sus funciones
  const mockUserService = {
    findAll: jest.fn(() => ['usuario1', 'usuario2']),
    register: jest.fn(newUser => newUser),
    login: jest.fn(() => ({ access_token: 'TOKEN' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService
        },
        {
          provide: JwtStrategy,
          useClass: JwtAuthGuard
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //Verificamos metodo de obtener todos los usuarios devuelve un array
  describe('obtenerUsuarios', () => {
    it('should return an array', async () => {
      //comparamos el valor que devuelve la funcion real con el esperado
      expect(await controller.obtenerUsuarios()).toEqual(['usuario1', 'usuario2']);
      //verificamos que se haya llamado la funcion
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  //Verificamos la creacion del usuario
  describe('createUser', () => {
    it('should create a user', async () => {
      const newUser: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword',
        IdRol: 0
      };

      await controller.createUser(newUser);

      expect(mockUserService.register).toHaveBeenCalledWith(newUser);
    });
  });

  describe('loginUser', () => {
    it('should return a JWT access token', async () => {
      const userObjectLogin: LoginUserDto = {
        username: 'testusername',
        password: 'testpassword',
      };

      const result = await controller.loginUser(userObjectLogin);

      expect(mockUserService.login).toHaveBeenCalledWith(userObjectLogin);
      expect(result).toEqual({ access_token: 'TOKEN' });
    });
  });

  /////////////////////////////////////////
  describe('obtenerUsuarios', () => {
    it('should return an array of users', async () => {
      const result: user[] = [{ IdUsuario: 1, username: 'test1', password: '12345', IdRol: 1 }, { IdUsuario: 2, username: 'test', password: '12345', IdRol: 1 }];
      jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve(result));

      expect(await controller.obtenerUsuarios()).toEqual(result);
    });
  });
  
});
