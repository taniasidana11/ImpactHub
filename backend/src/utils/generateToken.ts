import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Response } from 'express';

const generateToken = (
  res: Response,
  id: Types.ObjectId,
  role: string
): string => {
  const token = jwt.sign(
    { id, role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;