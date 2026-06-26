import app from './app';
import { connectDatabase, sequelize } from './config/database';
import { env } from './config/environment';
import { initializeModels } from './models';
import { startTaskWorker, stopTaskWorker } from './queues/task.worker';

async function bootstrap(): Promise<void> {
  initializeModels();

  await connectDatabase();
  await sequelize.sync();

  startTaskWorker();

  app.listen(env.port, () => {
    console.log(`Task management API listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start the server:', error);
  process.exitCode = 1;
});

async function shutdown(signal: string): Promise<void> {
  console.log(`Received ${signal}, shutting down...`);

  await stopTaskWorker();
  await sequelize.close();

  process.exit(0);
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});