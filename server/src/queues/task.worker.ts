import { Job, Worker } from 'bullmq';
import { redisConnection } from '../config/redis';
import { TaskAssignmentJob } from './task.queue';

let worker: Worker<TaskAssignmentJob> | null = null;

export function startTaskWorker(): Worker<TaskAssignmentJob> {
  if (worker) {
    return worker;
  }

  // The worker boots once with the HTTP server and listens on Redis for background jobs.
  // This keeps slow work, like sending an assignment email, outside the request lifecycle.
  worker = new Worker<TaskAssignmentJob>(
    'task-queue',
    async (job: Job<TaskAssignmentJob>) => {
      console.log(`[BullMQ] Processing job ${job.id} - Sending assignment email for task ${job.data.taskId}`);

      // Simulate email sending delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(`[BullMQ] Email sent to ${job.data.assigneeEmail} for task ${job.data.taskId}`);

      return { delivered: true };
    },
    {
      connection: redisConnection
    }
  );

  worker.on('completed', (completedJob) => {
    console.log(`Worker completed job ${completedJob.id}`);
  });

  worker.on('failed', (failedJob, error) => {
    console.error(`Worker failed job ${failedJob?.id ?? 'unknown'}`, error);
  });

  return worker;
}

export async function stopTaskWorker(): Promise<void> {
  if (!worker) {
    return;
  }

  await worker.close();
  worker = null;
}