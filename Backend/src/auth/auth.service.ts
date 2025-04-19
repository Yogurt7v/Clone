import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { compare } from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayloads';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from "argon2"
import { error } from 'console';
import { CurrentUser } from './types/current-user';


@Injectable()
export class AuthService {

  constructor(
    private UserService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.UserService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const comparePasswords = await compare(password, user.password);
    if (!comparePasswords) {
      throw new UnauthorizedException('Неверный пароль');
    }

    return {
      id: user.id,
    };
  }


  async login(userId: number) {
    const { accessToken, refreshToken } = await this.generateToken(userId)
    const hashedRefreshToken = await argon2.hash(refreshToken)
    await this.UserService.updateHashedReferenceToken(userId, hashedRefreshToken)
    const user = await this.UserService.findOne(userId)
    return ({
      id: userId,
      accessToken,
      refreshToken,
      message: "Вы успешно авторизовались",
      role: user.role
    })
  }

  async register(dto: CreateUserDto) {
    const { user, message } = await this.UserService.create(dto);

    if (!user) {
      return { message: message, user: {} }
    }

    const response = await this.login(user.id)
    return { ...response, message: "Вы зарегистрировались" }
  }

  async generateToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId }
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload),
      this.jwtService.sign(payload, this.refreshTokenConfig),
    ])
    return { accessToken, refreshToken }
  }

  async refreshToken(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.UserService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      id: +userId,
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {

    const user = await this.UserService.findOne(userId);
    if (!user || !user.hashedRefreshToken)
      throw new UnauthorizedException('Невалидный refresh token');

    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new UnauthorizedException('Невалидный refresh token 2');

    return { id: userId };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async signOut(userId: number) {
    await this.UserService.updateHashedRefreshToken(userId, "");
    await this.UserService.updateHashedReferenceToken(userId, "");
    return { message: "Вы вышли из аккаунта" };
  }

  async validateJwtUser(userId: number) {
    const user = await this.UserService.findOne(userId);
    if (!user)
      throw new UnauthorizedException('Пользователь не найден. Не пройдена JwtValidationUser');
    const currentUser: CurrentUser = { id: user.id, role: user.role }
    return currentUser;
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.UserService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.UserService.create(googleUser);
  }
}


