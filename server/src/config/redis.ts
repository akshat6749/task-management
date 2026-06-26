import { ConnectionOptions } from 'bullmq';
import { env } from './environment';

export const redisConnection: ConnectionOptions = {
  host: env.redisHost,
  port: env.redisPort,
  password: env.redisPassword,
  maxRetriesPerRequest: null
};