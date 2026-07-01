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
    const userId = _req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    const tasks = await Task.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
}

export async function getTaskById(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const taskId = parseTaskId(req.params.id);

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    if (!taskId) {
      res.status(400).json({ message: 'Task id must be a positive integer.' });
      return;
    }

    const task = await Task.findOne({ where: { id: taskId, userId } });

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
    const authenticatedUserId = req.user?.id;
    const userEmail = req.user?.email;
    const { title, description, status } = req.body as Partial<TaskCreationAttributes> & {
      status?: TaskStatus;
    };

    if (!authenticatedUserId || !userEmail) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    if (!title || !title.trim()) {
      res.status(400).json({ message: 'Task title is required.' });
      return;
    }

    if (status !== undefined && !isTaskStatus(status)) {
      res.status(400).json({ message: `Task status must be one of: ${VALID_STATUSES.join(', ')}.` });
      return;
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ?? null,
      status: status ?? 'TODO',
      userId: authenticatedUserId
    });

    await enqueueTaskAssignment({
      taskId: task.id,
      assigneeEmail: userEmail
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Failed to create task:', error);
    res.status(500).json({ message: 'Failed to create task.' });
  }
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const taskId = parseTaskId(req.params.id);

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    if (!taskId) {
      res.status(400).json({ message: 'Task id must be a positive integer.' });
      return;
    }

    const task = await Task.findOne({ where: { id: taskId, userId } });

    if (!task) {
      res.status(404).json({ message: 'Task not found.' });
      return;
    }

    const { title, description, status } = req.body as Partial<TaskCreationAttributes> & {
      status?: TaskStatus;
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

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.error('Failed to update task:', error);
    res.status(500).json({ message: 'Failed to update task.' });
  }
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const taskId = parseTaskId(req.params.id);

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    if (!taskId) {
      res.status(400).json({ message: 'Task id must be a positive integer.' });
      return;
    }

    const task = await Task.findOne({ where: { id: taskId, userId } });

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
