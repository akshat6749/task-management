import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.routes';
import router from './routes/task.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;