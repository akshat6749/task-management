import { Request, Response } from 'express';
import { Task, TaskCreationAttributes, TaskStatus } from '../models';
import { enqueueTaskAssignment } from '../queues/task.queue';

const VALID_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

function parseTaskId(rawId: string | string[]): number | null {
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && VALID_STATUSES.includes(value as TaskStatus);
}

export async function getTasks(_req: Request, res: Response): Promise<void> {
  try {
    const tasks = await Task.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
}

export async function getTaskById(req: Request, res: Response): Promise<void> {
  try {
    const taskId = parseTaskId(req.params.id);

    if (!taskId) {
      res.status(400).json({ message: 'Task id must be a positive integer.' });
      return;
    }

    const task = await Task.findByPk(taskId);

    if (!task) {
      res.status(404).json({ message: 'Task not found.' });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Failed to fetch task:', error);
    res.status(500).json({ message: 'Failed to fetch task.' });
  }
}

export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, status, userId } = req.body as Partial<TaskCreationAttributes> & {
      status?: TaskStatus;
      userId?: number | null;
    };

    if (!title || !title.trim()) {
      res.status(400).json({ message: 'Task title is required.' });
      return;
    }

    if (status !== undefined && !isTaskStatus(status)) {
      res.status(400).json({ message: `Task status must be one of: ${VALID_STATUSES.join(', ')}.` });
      return;
    }

    if (userId !== undefined && userId !== null && (!Number.isInteger(userId) || userId <= 0)) {
      res.status(400).json({ message: 'userId must be a positive integer or null.' });
      return;
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ?? null,
      status: status ?? 'TODO',
      userId: userId ?? null
    });

    await enqueueTaskAssignment({
      taskId: task.id,
      assigneeEmail: 'team@example.com'
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Failed to create task:', error);
    res.status(500).json({ message: 'Failed to create task.' });
  }
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  try {
    const taskId = parseTaskId(req.params.id);

    if (!taskId) {
      res.status(400).json({ message: 'Task id must be a positive integer.' });
      return;
    }

    const task = await Task.findByPk(taskId);

    if (!task) {
      res.status(404).json({ message: 'Task not found.' });
      return;
    }

    const { title, description, status, userId } = req.body as Partial<TaskCreationAttributes> & {
      status?: TaskStatus;
      userId?: number | null;
    };

    if (title !== undefined) {
      if (!title.trim()) {
        res.status(400).json({ message: 'Task title cannot be empty.' });
        return;
      }

      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (status !== undefined) {
      if (!isTaskStatus(status)) {
        res.status(400).json({ message: `Task status must be one of: ${VALID_STATUSES.join(', ')}.` });
        return;
      }

      task.status = status;
    }

    if (userId !== undefined) {
      if (userId !== null && (!Number.isInteger(userId) || userId <= 0)) {
        res.status(400).json({ message: 'userId must be a positive integer or null.' });
        return;
      }

      task.userId = userId;
    }

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error('Failed to update task:', error);
    res.status(500).json({ message: 'Failed to update task.' });
  }
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const taskId = parseTaskId(req.params.id);

    if (!taskId) {
      res.status(400).json({ message: 'Task id must be a positive integer.' });
      return;
    }

    const task = await Task.findByPk(taskId);

    if (!task) {
      res.status(404).json({ message: 'Task not found.' });
      return;
    }

    await task.destroy();

    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete task:', error);
    res.status(500).json({ message: 'Failed to delete task.' });
  }
}
