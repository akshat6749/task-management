import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment';

interface JwtUserPayload {
  id: number;
  email: string;
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized.' });
    return;
  }

  const token = authHeader.slice(7).trim();

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'email' in decoded) {
      req.user = {
        id: Number((decoded as JwtUserPayload).id),
        email: String((decoded as JwtUserPayload).email)
      };

      next();
      return;
    }

    res.status(401).json({ message: 'Unauthorized.' });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized.' });
  }
}