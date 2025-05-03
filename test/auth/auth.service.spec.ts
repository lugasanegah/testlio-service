import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/domain/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a JWT token', async () => {
      const email = 'user@example.com';
      const token = 'jwt-token';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await service.generateToken(email);

      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { email },
        { secret: 'test-secret' },
      );
      expect(result).toBe(token);
    });
  });
});