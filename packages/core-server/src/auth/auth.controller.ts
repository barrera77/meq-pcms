import {
  Controller,
  Body,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  Res,
} from '@nestjs/common';
import { RegisterDto } from 'src/dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(loginDto);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });

    return { message: 'Login successfull' };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    const userData = await this.authService.verifyRefreshtoken(refreshToken);
    const newTokens = this.authService.generateTokens(
      userData.sub,
      userData.email,
      userData.role,
      userData.city,
    );
    res.cookie('accessToken', newTokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });

    return {
      message: 'Token refreshed succesfully',
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return { message: 'Logged out succesfully' };
  }
}
