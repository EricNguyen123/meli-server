import 'dotenv/config';
import * as joi from 'joi';

interface EnvConfig {
  MYSQL_PORT: number;
  MYSQL_USERNAME: string;
  MYSQL_DB_NAME: string;
  MYSQL_PASSWORD: string;
  MYSQL_HOST: string;
  JWT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
}

const envVarsSchema = joi
  .object({
    MYSQL_DB_NAME: joi.string().required(),
    MYSQL_USERNAME: joi.string().required(),
    MYSQL_PASSWORD: joi.string().required(),
    MYSQL_PORT: joi.number().required(),
    MYSQL_HOST: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_SECRET: joi.string().required(),
    GOOGLE_CALLBACK_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvConfig = value;

export const envs = {
  database: envVars.MYSQL_DB_NAME,
  user: envVars.MYSQL_USERNAME,
  password: envVars.MYSQL_PASSWORD,
  dbport: envVars.MYSQL_PORT,
  host: envVars.MYSQL_HOST,
  jwtSecret: envVars.JWT_SECRET,
  googleClientId: envVars.GOOGLE_CLIENT_ID,
  googleClientSecret: envVars.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: envVars.GOOGLE_CALLBACK_URL,
};
