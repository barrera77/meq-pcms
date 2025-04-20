import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAccessTokenStrategyStrategy } from './strategies/jwtAccessToken.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshTokenStrategy } from './strategies/jwtRefreshToken.strategy';
import { RolesGuard } from './roles.guard';
@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessTokenStrategyStrategy,
    JwtRefreshTokenStrategy,
    RolesGuard,
  ],
})
export class AuthModule {}
