import dotenv from 'dotenv';
import { app } from './app';
import { prisma } from './db';
import { Decimal } from '@prisma/client/runtime';

dotenv.config();

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return Number(this);
};

app()
  .then((app) => {
    const port = process.env.PORT ?? 8080;
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch(async (err) => {
    console.log(err);
    await prisma.$disconnect();
  });
