import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';
import { PlayerPeriodWithTotalPoints } from '../models/periods.models';

const periodRouter = Router();

periodRouter.get(
  '/',
  checkPermissions('read:periods'),
  async (req: Request, res: Response) => {
    try {
      const periods = await prisma.period.findMany({
        orderBy: {
          startDate: 'desc',
        },
      });
      return res.status(200).send(
        periods.map((p) => ({
          ...p,
          reward: Number(p.reward),
        })),
      );
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

periodRouter.patch(
  '/:periodId/reward',
  checkPermissions('write:periods'),
  async (req: Request, res: Response) => {
    try {
      const periodId = req.params.periodId;
      if (!periodId)
        return res.status(400).send({ message: 'PeriodId nécessaire' });

      const { reward } = req.body;
      if (!reward)
        return res.status(400).send({ message: 'Récompense manquante' });

      await prisma.period.update({
        where: {
          id: Number(periodId),
        },
        data: {
          reward: Number(reward),
        },
      });
      return res.status(200).send({});
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

periodRouter.patch(
  '/reward-paiement',
  checkPermissions('write:periods'),
  async (req: Request, res: Response) => {
    try {
      const { rewarded, periodId, playerId } = req.body;
      if (!periodId)
        return res.status(400).send({ message: 'PeriodId nécessaire' });
      if (!playerId)
        return res.status(400).send({ message: 'PlayerId nécessaire' });
      if (!rewarded)
        return res.status(400).send({ message: 'Statut du paiement manquant' });

      await prisma.playerPeriod.update({
        where: {
          playerId_periodId: {
            periodId: Number(periodId),
            playerId: Number(playerId),
          },
        },
        data: {
          rewarded: Boolean(rewarded),
        },
      });
      return res.status(200).send({});
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

periodRouter.get(
  '/:periodId/games',
  checkPermissions('read:periods'),
  async (req: Request, res: Response) => {
    try {
      const periodId = req.params.periodId;
      if (!periodId)
        return res.status(400).send({ message: 'PeriodId nécessaire' });

      const games = await prisma.pvpGame.findMany({
        where: {
          periodId: Number(periodId),
        },
        include: {
          player1: true,
          player2: true,
          player3: true,
          player4: true,
          player5: true,
        },
        orderBy: {
          id: 'asc',
        },
      });
      return res.status(200).send({ games });
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

periodRouter.get(
  '/:periodId/players',
  checkPermissions('read:periods'),
  async (req: Request, res: Response) => {
    try {
      const periodId = req.params.periodId;
      if (!periodId)
        return res.status(400).send({ message: 'PeriodId nécessaire' });

      const playersPeriods = await prisma.playerPeriod.findMany({
        where: {
          periodId: Number(periodId),
        },
        include: {
          player: true,
          period: true,
        },
        orderBy: {
          player: {
            nickname: 'asc',
          },
        },
      });

      const games = await prisma.pvpGame.findMany({
        where: {
          periodId: Number(periodId),
        },
      });
      const totalGamesPoints = Number(
        games
          .reduce(
            (previousValue, currentGame) =>
              previousValue + Number(currentGame.gamePoints),
            0,
          )
          .toFixed(2),
      );

      const playersPeriodsWithPoints: PlayerPeriodWithTotalPoints[] = [];
      for (const playerPeriod of playersPeriods) {
        const playerGames = await prisma.pvpGame.findMany({
          where: {
            AND: [
              { periodId: Number(periodId) },
              {
                OR: [
                  { player1Id: playerPeriod.player.id },
                  { player2Id: playerPeriod.player.id },
                  { player3Id: playerPeriod.player.id },
                  { player4Id: playerPeriod.player.id },
                  { player5Id: playerPeriod.player.id },
                ],
              },
            ],
          },
        });
        const totalPoints = Number(
          playerGames
            .reduce(
              (previousValue, currentValue) =>
                previousValue + Number(currentValue.gamePoints),
              0,
            )
            .toFixed(2),
        );
        let reward = 0;
        const playerPeriodReward = Number(playerPeriod.period.reward);
        if (totalGamesPoints > 0) {
          const participation = Number(
            (totalPoints / totalGamesPoints).toFixed(2),
          );
          reward = Number((playerPeriodReward * participation).toFixed(2));
        }
        playersPeriodsWithPoints.push({ ...playerPeriod, totalPoints, reward });
      }

      return res.status(200).send(playersPeriodsWithPoints);
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

periodRouter.get(
  '/:periodId/games/:playerId',
  checkPermissions('read:periods'),
  async (req: Request, res: Response) => {
    try {
      const periodId = req.params.periodId;
      if (!periodId)
        return res.status(400).send({ message: 'PeriodId nécessaire' });

      const playerId = req.params.playerId;
      if (!playerId)
        return res.status(400).send({ message: 'PlayerId nécessaire' });

      const games = await prisma.pvpGame.findMany({
        where: {
          AND: [
            { periodId: Number(periodId) },
            {
              OR: [
                { player1Id: Number(playerId) },
                { player2Id: Number(playerId) },
                { player3Id: Number(playerId) },
                { player4Id: Number(playerId) },
                { player5Id: Number(playerId) },
              ],
            },
          ],
        },
        include: {
          player1: true,
          player2: true,
          player3: true,
          player4: true,
          player5: true,
        },
        orderBy: {
          id: 'asc',
        },
      });

      return res.status(200).send(games);
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

periodRouter.get(
  '/active',
  checkPermissions('read:periods'),
  async (req: Request, res: Response) => {
    try {
      const period = await prisma.period.findFirst({
        where: {
          endDate: null,
        },
      });
      return res.status(200).send(period);
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

periodRouter.post(
  '/',
  checkPermissions('write:periods'),
  async (req: Request, res: Response) => {
    try {
      const openPeriod = await prisma.period.findFirst({
        where: {
          endDate: null,
        },
      });
      if (openPeriod) {
        await prisma.period.update({
          where: {
            id: openPeriod.id,
          },
          data: {
            endDate: new Date(),
          },
        });
      }

      const newPeriod = await prisma.period.create({
        data: {
          startDate: new Date(),
        },
      });

      return res.status(200).send(newPeriod);
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

periodRouter.put(
  `/:periodId/close`,
  checkPermissions('write:periods'),
  async (req: Request, res: Response) => {
    try {
      const periodId = req.params.periodId;
      if (!periodId)
        return res.status(400).send({ message: `Periode id manquant` });

      const period = await prisma.period.findFirst({
        where: {
          id: Number(periodId),
        },
      });
      if (!period)
        return res
          .status(400)
          .send({ message: `Aucune période avec cette id n'a été trouvée` });

      await prisma.period.update({
        where: {
          id: Number(periodId),
        },
        data: {
          endDate: new Date(),
        },
      });

      return res.status(200).send();
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

periodRouter.delete(
  '/:periodId',
  checkPermissions('delete:periods'),
  async (req: Request, res: Response) => {
    try {
      const periodId = req.params.periodId;
      if (!periodId)
        return res.status(400).send({ message: `Periode id manquant` });

      await prisma.period.delete({
        where: {
          id: Number(periodId),
        },
      });

      return res.status(200).send();
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

export { periodRouter };
