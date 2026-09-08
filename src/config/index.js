require('dotenv').config();
const Joi = require('joi');

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  JWT_SECRET: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.string().min(32).required(),
      otherwise: Joi.string().min(1).required(),
    }),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().port().default(5432),
  DB_NAME: Joi.string().default('boilerplate'),
  DB_USER: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.string().min(1).required(),
    otherwise: Joi.string().allow('').default(''),
  }),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly', 'silent')
    .default('info'),
  RATE_LIMIT_WINDOW_MS: Joi.number().integer().positive().default(900000),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().integer().positive().default(100),
  BODY_LIMIT: Joi.string().default('1mb'),
}).unknown(true);

const { error, value: env } = envSchema.validate(process.env, {
  abortEarly: false,
  convert: true,
});

if (error) {
  throw new Error(`Invalid environment configuration: ${error.message}`);
}

const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  db: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  log: {
    level: env.LOG_LEVEL,
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
  },
  http: {
    bodyLimit: env.BODY_LIMIT,
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
};

module.exports = Object.freeze(config);
