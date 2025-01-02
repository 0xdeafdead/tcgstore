import { configDotenv } from 'dotenv';
import * as joi from 'joi';

configDotenv({ path: 'apps/base-api/.env' });

interface EnvVars {
  PORT: number;
  JWT_SECRET: string;
  BASE_API_AUDIENCE: string;
  BASE_API_ISSUER: string;
  APP_ENV: string;
  USER_ROLE_ID: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    JWT_SECRET: joi.string().required(),
    BASE_API_AUDIENCE: joi.string().required(),
    BASE_API_ISSUER: joi.string().required(),
    APP_ENV: joi.string().required(),
    USER_ROLE_ID: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value as EnvVars;

export const envs = {
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  audience: envVars.BASE_API_AUDIENCE,
  issuer: envVars.BASE_API_ISSUER,
  app_env: envVars.APP_ENV,
  user_role_id: envVars.USER_ROLE_ID,
};
