import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';

const pvpGamesRouter = Router();

pvpGamesRouter.get(
  '/',
  checkPermissions('read:pvp-games'),
  async (req: Request, res: Response) => {
    try {
      const games = await prisma.pvpGame.findMany();
      return res.status(200).send(games);
    } catch (e) {
      return res.status(500).send(e);
    }
  },
);

pvpGamesRouter.get(
  '/period/:periodId',
  checkPermissions('read:pvp-games'),
  async (req: Request, res: Response) => {
    try {
      const periodId = req.params.periodId;
      if (!periodId)
        return res.status(400).send({ message: 'PeriodId nécessaire' });

      const games = await prisma.pvpGame.findMany({
        where: {
          id: Number(periodId),
        },
      });
      return res.status(200).send(games);
    } catch (e) {
      return res.status(500).send(e);
    }
  },
);

pvpGamesRouter.delete(
  '/:gameId',
  checkPermissions('delete:pvp-games'),
  async (req: Request, res: Response) => {
    try {
      const gameId = req.params.gameId;
      if (!gameId)
        return res.status(400).send({ message: 'GameId nécessaire' });

      await prisma.pvpGame.delete({
        where: {
          id: Number(gameId),
        },
      });
      return res.status(200).send();
    } catch (e) {
      return res.status(500).send(e);
    }
  },
);

export { pvpGamesRouter };
