import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

interface LoginDto {
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    const token = await this.authService.generateToken(loginDto.email);
    return { access_token: token };
  }
}