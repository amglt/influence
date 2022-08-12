import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret) {
      try {
        jwt.verify(token, jwtSecret);
        return next();
      } catch (e) {
        return res.status(403).send({
          message: `Vous n'avez pas accès à cette app`,
        });
      }
    }
    return res.status(500).send({ message: 'JWT Secret introuvable' });
  }
};
