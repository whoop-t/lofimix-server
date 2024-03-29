const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    CORS_ORIGIN: Joi.string().required().default('http://localhost:3000').description('CORS allowed origin'),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    AWS_ACCESS_KEY_ID: Joi.string().required().description('AWS Access key'),
    AWS_SECRET_KEY: Joi.string().required().description('AWS secret key'),
    TRACKS_BUCKET: Joi.string().required().description('Tracks bucket name'),
    COVERS_BUCKET: Joi.string().required().description('Covers bucket name'),
    AVATARS_BUCKET: Joi.string().required().description('Avatars bucket name'),
    URL_EXPIRE: Joi.number().required().description('Url expire time'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    PASS: Joi.string().description('Password for lofimix email'),
    SERVICE: Joi.string().description('Service being used for nodemailer'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  cors_origin: envVars.CORS_ORIGIN,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  },
  aws: {
    access: envVars.AWS_ACCESS_KEY_ID,
    secret: envVars.AWS_SECRET_KEY,
    tracksBucket: envVars.TRACKS_BUCKET,
    coversBucket: envVars.COVERS_BUCKET,
    avatarsBucket: envVars.AVATARS_BUCKET,
    urlExpire: envVars.URL_EXPIRE,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
  email: {
    service: envVars.SERVICE,
    auth: {
      user: envVars.EMAIL_FROM,
      pass: envVars.PASS,
    },
    // smtp: {
    //   host: envVars.SMTP_HOST,
    //   port: envVars.SMTP_PORT,
    //   auth: {
    //     user: envVars.SMTP_USERNAME,
    //     pass: envVars.SMTP_PASSWORD,
    //   },
    // },
    // from: envVars.EMAIL_FROM,
  },
};
