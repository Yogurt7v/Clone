import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from "../user/dto/createUser.dto"
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guards';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard("local"))
  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    const { id } = await this.authService.validateUser(credentials.email, credentials.password);
    return this.authService.login(id)
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return await this.authService.register(user);
  }

  @Post("refresh")
  @UseGuards(RefreshAuthGuard)
  async refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @Post("signout")
  @UseGuards(JwtAuthGuard)
  async signOut(@Req() req) {
    return this.authService.signOut(req.user.id);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin() { }


  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.login(req.user.id);
    console.log(response);
    // res.redirect(
    //   `http://localhost:3000/auth/success?` +
    //   `access_token=${response.accessToken}&` +
    //   `refresh_token=${response.refreshToken}`
    // );

    res.send(`
      <script>
        window.opener.postMessage({ 
        token: "${response.accessToken}",
        userId: "${response.id}",
        role: "${response.role}",
        refreshToken: "${response.refreshToken}"
          }, "http://localhost:3000/");
        window.close();
      </script>
    `);
    return response;
  }
}
