import { auth } from 'express-oauth2-jwt-bearer';

export const authenticationMiddleware = () => {
  return auth({
    audience: `${process.env.AUDIENCE}`,
    issuerBaseURL: `https://${process.env.DOMAIN}/`,
  });
};
