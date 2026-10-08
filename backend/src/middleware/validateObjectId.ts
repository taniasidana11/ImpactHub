import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../types/index';

const validateObjectId = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid ID format' });
    return;
  }
  next();
};

export default validateObjectId;