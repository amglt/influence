import express, { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { authenticationMiddleware } from './middlewares/authentication.middleware';
import { managementRouter } from './controllers/management.controller';
import { usersRouter } from './controllers/users.controller';
import { accountsRouter } from './controllers/accounts.controller';
import { charactersRouter } from './controllers/characters.controller';
import { prisma } from './db';
import { recordsRouter, walletsRouter } from './controllers/wallets.controller';

export const app = async () => {
  const app = express();

  await prisma.$connect();

  app.use(express.json());
  app.use(morgan('tiny'));
  app.use(helmet());
  app.use(
    cors({
      origin: [process.env.ORIGIN ?? 'http://localhost:3000'],
    }),
  );

  app.get('/', (_req: Request, res: Response) => {
    return res.send('Service is running well');
  });

  app.use(authenticationMiddleware());
  app.use('/management', managementRouter);
  app.use('/users', usersRouter);
  app.use('/accounts', accountsRouter);
  app.use('/characters', charactersRouter);
  app.use('/wallets', walletsRouter);
  app.use('/records', recordsRouter);

  return app;
};
