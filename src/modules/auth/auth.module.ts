import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { envs } from 'src/config/envs';
import { UserModule } from '../users/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from '../users/user.service';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from 'src/config/oauth/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { LocalStrategy } from './strategies/local-strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      useFactory: () => ({
        secret: envs.jwtSecret,
        signOptions: { expiresIn: '1h' },
      }),
    }),
    ConfigModule.forFeature(googleOauthConfig),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
  ],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
