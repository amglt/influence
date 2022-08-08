import { NextFunction, Request, Response } from 'express';

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
  }
  return next();
};
