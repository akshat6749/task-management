import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from '../controllers/task.controller';

const router = Router();

// Incoming requests enter the router, pass to the controller, then fall through to centralized error handling if needed.
router.use(authenticateJWT);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;