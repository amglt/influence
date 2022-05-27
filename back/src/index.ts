import dotenv from 'dotenv';
import { app } from './app';
import { prisma } from './db';

dotenv.config();

app()
  .then((app) => {
    const port = process.env.PORT ?? 8080;
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  })
  .catch(async () => {
    await prisma.$disconnect();
  });
