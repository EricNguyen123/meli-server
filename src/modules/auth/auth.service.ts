import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/dto/register.dto';
import { GoogleDto } from 'src/dto/google.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { ChangePasswordDto } from 'src/dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password, name, email } = registerDto;
    const user = await this.usersService.create({
      name: name,
      email: email,
      password: bcrypt.hashSync(password, 10),
    });
    delete user.password;

    return user;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credentials not valid');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    const token = this.getJwtToken(user.id);

    delete user.password;
    delete user.createdDate;

    return {
      user,
      token,
    };
  }

  async loginWithGoogle({ email }: { email: string }) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credentials not valid');
    }
    const token = this.getJwtToken(user.id);

    delete user.password;
    delete user.createdDate;
    return {
      user,
      token,
    };
  }

  async logout(token: string) {
    const decodedToken = this.jwtService.decode(token) as { exp: number };

    if (!decodedToken || !decodedToken.exp) {
      throw new UnauthorizedException('Invalid token');
    }

    const ttl = decodedToken.exp - Math.floor(Date.now() / 1000);

    await this.redis.set(`blacklist:${token}`, 'true', 'EX', ttl);
    return { status: 200, message: 'Logout successful' };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { id, currentPassword, password } = changePasswordDto;

    return await this.usersService.updatePassword(
      id,
      currentPassword,
      password,
    );
  }

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async validateUser(id: string): Promise<UserEntity> {
    const user = await this.usersService.findOneById(id);

    delete user.password;

    return user;
  }

  async validateCheckUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;

      return user;
    }
    return null;
  }

  async validateGoogleUser(googleUser: GoogleDto) {
    const user = await this.usersService.findOneByEmail(googleUser.email);
    if (user) return user;
    const randomPassword = this.generateRandomPassword(10);
    googleUser.password = bcrypt.hashSync(randomPassword, 10);
    return await this.usersService.create(googleUser);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const isBlacklisted = await this.redis.get(`blacklist:${token}`);
    return !!isBlacklisted;
  }

  generateRandomPassword(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  }
}
