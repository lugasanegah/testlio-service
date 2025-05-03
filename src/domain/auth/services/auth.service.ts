import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  validateToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, {
        secret: AUTH_CONSTANTS.JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }
}