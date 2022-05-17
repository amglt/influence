import jwt_decode from 'jwt-decode';
import { Request, Response, NextFunction } from 'express';

type DecodedToken = {
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  permissions: string[];
};

export const checkPermissions =
  (permissions: string | string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decodedToken = jwt_decode(token) as DecodedToken;
      if (decodedToken.permissions && decodedToken.permissions.length > 0) {
        let isValid = false;
        if (Array.isArray(permissions)) {
          if (
            permissions.every((perm) => decodedToken.permissions.includes(perm))
          )
            isValid = true;
        } else {
          if (decodedToken.permissions.includes(permissions)) isValid = true;
        }
        if (isValid) return next();
        return res.status(403).send({
          message: `Vous n'avez pas la permission d'obtenir ce contenu`,
        });
      }
    }
  };
