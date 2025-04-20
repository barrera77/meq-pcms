import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from 'src/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, role, city } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
      city,
    });

    const savedUser = await createdUser.save();

    return {
      message: 'User registration succesfull!',
      user: {
        id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
        city: savedUser.city,
      },
    };
  }

  async login(LoginDto: LoginDto) {
    const { email, password } = LoginDto;

    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const tokens = this.generateTokens(
      user._id.toString(),
      user.email,
      user.role,
      user.city,
    );

    return {
      message: 'Login Successfull',
      ...tokens,
    };
  }

  //Verify the refresToken
  async verifyRefreshtoken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid refreshToken');
    }
  }

  //Generate tokens
  generateTokens(userId: string, email: string, role: string, city: string) {
    const payload = { sub: userId, email, role, city };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRY'),
    });
    return { accessToken, refreshToken };
  }
}
