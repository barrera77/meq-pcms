import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Roles('admin')
  @Get('all-users')
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }
}
