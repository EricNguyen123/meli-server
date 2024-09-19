import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    if (password === '')
      throw new UnauthorizedException('Please Provide The Password');
    const user = await this.authService.validateCheckUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
