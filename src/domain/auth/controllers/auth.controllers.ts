import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Generate a JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'JWT token generated successfully',
    type: Object,
    example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    example: { statusCode: 400, message: 'Invalid email format', error: 'Bad Request' },
  })
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    const token = await this.authService.generateToken(loginDto.email);
    return { access_token: token };
  }
}