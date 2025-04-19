import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AuthJwtPayload } from "../types/auth-jwtPayloads";
import refreshJwtConfig from "../config/refresh-jwt.config";
import { AuthService } from "../auth.service";
import { Request } from 'express';


@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, "refresh-jwt") {

    constructor(
        @Inject(refreshJwtConfig.KEY)
        private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
        private authService: AuthService,) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: refreshJwtConfiguration.secret,
            ignoreExpiration: false,
            passReqToCallback: true
        })
    }

    validate(req: Request, payload: AuthJwtPayload) {
        const header = req.get('authorization')
        if (!header) {
            throw new Error('Неверный или отсутствующий заголовок Authorization');
        }
        const refreshToken = header.replace('Bearer', '').trim();
        const userId = payload.sub;
        return this.authService.validateRefreshToken(userId, refreshToken);
    }
}