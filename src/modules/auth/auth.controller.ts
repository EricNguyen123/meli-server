import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/dto/register.dto';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-guards/local-auth.guard';
import { ChangePasswordDto } from 'src/dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.body);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.loginWithGoogle({
      email: req.user.email,
    });

    const token = encodeURIComponent(response.token);
    const email = encodeURIComponent(response.user.email);
    res.redirect(`http://localhost:3000?token=${token}&email=${email}`);
  }

  @Post('callback/login')
  async callbackLogin(@Body() data) {
    return await this.authService.loginWithGoogle({ email: data.email });
  }

  @Post('logout')
  async logout(@Body() data) {
    return await this.authService.logout(data.token);
  }

  @Post('update/password')
  updatePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
