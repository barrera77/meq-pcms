import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from 'src/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';

type User = {
  email: string;
  password: string;
};
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private users: User[] = [];

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = { email, password: hashedPassword };
    this.users.push(user);

    return {
      message: 'User registration succesfull!',
      user: {
        email,
      },
    };
  }

  async login(LoginDto: LoginDto) {
    const { email, password } = LoginDto;

    const user = this.users.find((u) => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = { email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login Successfull',
      accessToken: token,
    };
  }
}
