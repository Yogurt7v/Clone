import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import refreshJwtConfig from './config/refresh-jwt.config';
import { RefreshJwtStrategy } from './strategies/refresh.stategy';
import googleOauthConfig from './config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // мы же будем обращаться к базе а конкретно к User
    JwtModule.registerAsync(jwtConfig.asProvider()), // регистрируем env файлы
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
    ConfigModule.forFeature(googleOauthConfig),
    PassportModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy, // сверяет логины и пароли
    JwtStrategy, // сверяет токены
    RefreshJwtStrategy,// сверяет и обновляет токен
    GoogleStrategy
  ], // выдаёт jwtToken для доступа к данным Api
})
export class AuthModule { }
