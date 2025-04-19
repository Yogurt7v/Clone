import { registerAs } from "@nestjs/config";
import { JwtSignOptions } from "@nestjs/jwt";

export default registerAs("refreshJwt", (): JwtSignOptions => ({
    secret: process.env.REFRESH_SECRET_KEY,
    expiresIn: process.env.REFRESH_JWT_EXPIRATION,
}))