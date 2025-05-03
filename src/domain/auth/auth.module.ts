import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { JwtAuthMiddleware } from './infrastucture/middleware/jwt-auth.middleware';
import { AUTH_CONSTANTS } from './constants/auth.constants';

@Module({
  imports: [
    JwtModule.register({
      secret: AUTH_CONSTANTS.JWT_SECRET,
      signOptions: { expiresIn: AUTH_CONSTANTS.TOKEN_EXPIRES_IN },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}