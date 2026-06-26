import { Sequelize } from 'sequelize';
import { env } from './environment';

export const sequelize = new Sequelize(env.dbName, env.dbUser, env.dbPassword, {
  host: env.dbHost,
  port: env.dbPort,
  dialect: 'mysql',
  logging: false
});

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
}