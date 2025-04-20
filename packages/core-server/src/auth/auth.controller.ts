import {
  Controller,
  Body,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from 'src/dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/login.dto';
import { RefreshTokenDto } from 'src/dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      const userData = await this.authService.verifyRefreshtoken(refreshToken);
      const newTokens = this.authService.generateTokens(
        userData.sub,
        userData.email,
      );

      return {
        message: 'Token refreshed succesfully',
        ...newTokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
