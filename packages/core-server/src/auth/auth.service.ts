import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from 'src/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({ email, password: hashedPassword });

    const savedUser = await createdUser.save();

    return {
      message: 'User registration succesfull!',
      user: {
        id: savedUser._id,
        email: savedUser.email,
      },
    };
  }

  async login(LoginDto: LoginDto) {
    const { email, password } = LoginDto;

    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login Successfull',
      accessToken: token,
    };
  }
}
