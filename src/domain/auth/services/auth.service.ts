import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(email: string): Promise<string> {
    const payload = { email };
    const secret = this.configService.get<string>('JWT_SECRET');
    return this.jwtService.signAsync(payload, { secret });
  }
}