import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const publicRoutes = ['/health', '/discovery'];
    if (publicRoutes.some((route) => req.originalUrl.startsWith(route))) {
      return next();
    }

    // Validate X-Client-ID
    const clientId = req.headers['x-client-id'] as string;
    if (!clientId) {
      return res.status(400).json({ message: 'X-Client-ID header is required' });
    }
    // Example: Allow only specific client IDs (customize as needed)
    const allowedClientIds = ['client-web', 'client-mobile', 'client-tablet'];
    if (!allowedClientIds.includes(clientId)) {
      return res.status(400).json({ message: 'Invalid X-Client-ID' });
    }

    // Validate JWT
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = this.jwtService.verify(token, { secret });
      req.user = payload;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}