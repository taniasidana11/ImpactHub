import { Request, Response, NextFunction } from 'express';

const sanitizeInput = (obj: Record<string, unknown>): void => {
  for (const key in obj) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeInput(obj[key] as Record<string, unknown>);
    }
  }
};

const sanitize = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body) sanitizeInput(req.body);
  if (req.query) sanitizeInput(req.query as Record<string, unknown>);
  next();
};

export default sanitize;