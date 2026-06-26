import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export interface TaskAssignmentJob {
  taskId: number;
  assigneeEmail: string;
}

export const taskQueue = new Queue<TaskAssignmentJob>('task-queue', {
  connection: redisConnection
});

export async function enqueueTaskAssignment(jobData: TaskAssignmentJob): Promise<void> {
  await taskQueue.add('send-assignment-email', jobData, {
    removeOnComplete: true,
    removeOnFail: 25
  });
}