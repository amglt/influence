import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';
import { RegressiveRate, Scale } from '@prisma/client';

export enum PvpGameResult {
  Loose,
  Win,
  ND,
}

export enum PvpGameType {
  Perco,
  Prism,
  AvA,
}

export enum PvpGameStatus {
  Pending,
  Rejected,
  Accepted,
}

const pvpGamesRouter = Router();

function getGameInitialPoints(
  scale: Scale,
  type: PvpGameType,
  result: PvpGameResult,
  isBigOpponent: boolean,
) {
  switch (type) {
    case PvpGameType.Perco: {
      switch (result) {
        case PvpGameResult.Win: {
          if (isBigOpponent) return scale.bigPercoWinPoints;
          else return scale.percoWinPoints;
        }
        case PvpGameResult.Loose: {
          if (isBigOpponent) return scale.bigPercoLoosePoints;
          else return scale.percoLoosePoints;
        }
        case PvpGameResult.ND: {
          if (isBigOpponent) return scale.bigPercoNDPoints;
          else return scale.percoNDPoints;
        }
        default:
          return scale.prismNDPoints;
      }
    }
    case PvpGameType.Prism: {
      switch (result) {
        case PvpGameResult.Win: {
          if (isBigOpponent) return scale.bigPrismWinPoints;
          else return scale.prismWinPoints;
        }
        case PvpGameResult.Loose: {
          if (isBigOpponent) return scale.prismLoosePoints;
          else return scale.prismLoosePoints;
        }
        case PvpGameResult.ND: {
          if (isBigOpponent) return scale.prismNDPoints;
          else return scale.prismNDPoints;
        }
        default:
          return scale.prismNDPoints;
      }
    }
    case PvpGameType.AvA: {
      if (result === PvpGameResult.Win) return scale.avaWin;
      return scale.avaLoose;
    }
  }
}

async function handleUserGame(
  gameId: number,
  user: string,
  periodId: number,
  gameInitialPoints: number,
  rates: RegressiveRate[],
) {
  let pointsToAdd = gameInitialPoints;
  if (rates.length > 0) {
    const userPeriodGames = await prisma.pvpGame.findMany({
      where: {
        AND: [
          { periodId },
          { status: PvpGameStatus.Accepted },
          {
            OR: [
              {
                player1: user,
              },
              {
                player2: user,
              },
              {
                player3: user,
              },
              {
                player4: user,
              },
              {
                player5: user,
              },
            ],
          },
        ],
      },
    });
    const smallerGames = userPeriodGames.filter((game) => !game.bigOpponent);
    const sortedRates = rates.sort((a, b) => a.gamesAmount - b.gamesAmount);
    let rate = undefined;
    for (const sortedRate of sortedRates) {
      if (smallerGames.length < sortedRate.gamesAmount) {
        rate = sortedRate;
        break;
      }
    }
    if (rate) pointsToAdd *= Number(rate.rate);
  }

  const existingUserOnPeriodRecord = await prisma.usersOnPeriods.findFirst({
    where: {
      AND: [{ periodId }, { userId: user }],
    },
  });
  if (existingUserOnPeriodRecord)
    await prisma.usersOnPeriods.update({
      where: {
        id: existingUserOnPeriodRecord.id,
      },
      data: {
        totalPoints: {
          increment: pointsToAdd,
        },
        pvpGames: {
          connect: {
            id: gameId,
          },
        },
      },
    });
  else
    await prisma.usersOnPeriods.create({
      data: {
        userId: user,
        periodId,
        totalPoints: pointsToAdd,
        pvpGames: {
          connect: {
            id: gameId,
          },
        },
      },
    });
}

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

pvpGamesRouter.post(
  '/',
  checkPermissions('write:pvp-games'),
  async (req: Request, res: Response) => {
    try {
      const body = req.body;

      const currentPeriod = await prisma.period.findFirst({
        where: {
          endDate: null,
        },
      });
      if (!currentPeriod)
        return res.status(400).send({
          message: 'Aucune période active',
        });

      const game = await prisma.pvpGame.create({
        data: {
          status: PvpGameStatus.Pending,
          periodId: currentPeriod.id,
          player1: body.player1,
          player2: body.player2,
          player3: body.player3,
          player4: body.player4,
          player5: body.player5,
          result: body.result,
          type: body.type,
          screenshotUrl: body.screenshotUrl,
          timestamp: new Date().toISOString(),
        },
      });

      return res.status(200).send(game);
    } catch (e) {
      return res.status(500).send(e);
    }
  },
);

pvpGamesRouter.put(
  '/:gameId',
  checkPermissions('write:pvp-games'),
  async (req: Request, res: Response) => {
    try {
      console.log(req.body, req.params);
      const gameId = req.params.gameId;
      if (!gameId)
        return res.status(400).send({ message: 'GameId nécessaire' });

      const { status } = req.body;
      if (status && status == PvpGameStatus.Rejected) {
        await prisma.pvpGame.update({
          where: {
            id: Number(gameId),
          },
          data: {
            status: PvpGameStatus.Rejected,
          },
        });
        return res.status(200).send({});
      }

      const currentPeriod = await prisma.period.findFirst({
        where: {
          endDate: null,
        },
      });
      if (!currentPeriod)
        return res.status(400).send({
          message: 'Aucune période active',
        });

      const game = await prisma.pvpGame.findFirst({
        where: { id: Number(gameId) },
      });

      if (game) {
        const scale = await prisma.scale.findFirst({
          where: {
            id: 1,
          },
        });
        const rates = await prisma.regressiveRate.findMany();
        if (scale && rates) {
          const initialPoints = await getGameInitialPoints(
            scale,
            game.type,
            game.result,
            req.body?.isBigAlliance,
          );
          await handleUserGame(
            game.id,
            game.player1,
            currentPeriod.id,
            initialPoints,
            rates,
          );
          if (game.player2)
            await handleUserGame(
              game.id,
              game.player2,
              currentPeriod.id,
              initialPoints,
              rates,
            );
          if (game.player3)
            await handleUserGame(
              game.id,
              game.player3,
              currentPeriod.id,
              initialPoints,
              rates,
            );
          if (game.player4)
            await handleUserGame(
              game.id,
              game.player4,
              currentPeriod.id,
              initialPoints,
              rates,
            );
          if (game.player5)
            await handleUserGame(
              game.id,
              game.player5,
              currentPeriod.id,
              initialPoints,
              rates,
            );
          await prisma.pvpGame.update({
            where: { id: Number(gameId) },
            data: { status: PvpGameStatus.Accepted },
          });
          return res.status(200).send({});
        }
      }
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
