import { registerAs } from '@nestjs/config';
import { envs } from '../envs';

export default registerAs('googleOAuth', () => ({
  clinetID: envs.googleClientId,
  clientSecret: envs.googleClientSecret,
  callbackURL: envs.googleCallbackUrl,
}));
