import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/domain/auth/controllers/auth.controllers';
import { AuthService } from '../../src/domain/auth/services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const loginDto = { email: 'user@example.com' };
      const token = 'jwt-token';
      jest.spyOn(authService, 'generateToken').mockResolvedValue(token);

      const result = await controller.login(loginDto);

      expect(authService.generateToken).toHaveBeenCalledWith(loginDto.email);
      expect(result).toEqual({ access_token: token });
    });
  });
});