export default () => ({
  environment: 'production',
  MONGODB_URI: process.env.MONGODB_URI,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: parseInt(process.env.REDIS_PORT, 10),
  REDIS_MAX_RETRIES: parseInt(process.env.REDIS_MAX_RETRIES, 10),
  EMAIL_COMPANY: process.env.EMAIL_COMPANY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
});
