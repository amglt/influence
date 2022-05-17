import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { managementRouter } from './controllers/management.controller';
import { authenticationMiddleware } from './middlewares/authentication.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 8080;

app.use(express.json());
app.use(morgan('tiny'));
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:3000'],
  }),
);

app.get('/', (_req: Request, res: Response) => {
  return res.send('Service is running well');
});

app.use(authenticationMiddleware());
app.use('/management', managementRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
