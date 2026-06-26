import dotenv from 'dotenv';

dotenv.config();

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(getEnv('PORT', '4000')),
  dbHost: getEnv('DB_HOST', '127.0.0.1'),
  dbPort: Number(getEnv('DB_PORT', '3306')),
  dbName: getEnv('DB_NAME', 'task_management'),
  dbUser: getEnv('DB_USER', 'root'),
  dbPassword: getEnv('DB_PASSWORD', 'password'),
  redisHost: getEnv('REDIS_HOST', '127.0.0.1'),
  redisPort: Number(getEnv('REDIS_PORT', '6379')),
  redisPassword: process.env.REDIS_PASSWORD || undefined
};