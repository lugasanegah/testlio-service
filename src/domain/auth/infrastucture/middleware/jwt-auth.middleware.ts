import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const publicRoutes = ['/health', '/discovery'];
    if (publicRoutes.some((route) => req.originalUrl.startsWith(route))) {
      return next();
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('JWT token is missing');
    }

    const clientId = req.headers['x-client-id'];
    if (!clientId) {
      throw new UnauthorizedException('X-Client-ID header is missing');
    }

    req.user = this.authService.validateToken(token);
    next();
  }
}