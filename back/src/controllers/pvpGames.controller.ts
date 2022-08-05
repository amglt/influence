import { Request, Response, Router } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';
import { Scale, PvpGame } from '@prisma/client';
import {
  PvpGameResult,
  PvpGameStatus,
  PvpGameType,
} from '../models/pvpGames.models';
import {
  getManagementClient,
  getRuntimeEnv,
  RuntimeEnv,
} from '../shared/utils';

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
        case PvpGameResult.AttackWin: {
          if (isBigOpponent) return scale.bigPercoAttackWinPoints;
          else return scale.percoAttackWinPoints;
        }
        case PvpGameResult.AttackLoose: {
          if (isBigOpponent) return scale.bigPercoAttackLoosePoints;
          else return scale.percoAttackLoosePoints;
        }
        case PvpGameResult.DefWin: {
          if (isBigOpponent) return scale.bigPercoDefWinPoints;
          else return scale.percoDefWinPoints;
        }
        case PvpGameResult.DefLoose: {
          if (isBigOpponent) return scale.bigPercoDefLoosePoints;
          else return scale.percoDefLoosePoints;
        }
        case PvpGameResult.ND: {
          if (isBigOpponent) return scale.bigPercoNDPoints;
          else return scale.percoNDPoints;
        }
        default:
          return scale.percoNDPoints;
      }
    }
    case PvpGameType.Prism: {
      switch (result) {
        case PvpGameResult.AttackWin: {
          if (isBigOpponent) return scale.bigPrismAttackWinPoints;
          else return scale.prismAttackWinPoints;
        }
        case PvpGameResult.AttackLoose: {
          if (isBigOpponent) return scale.bigPrismAttackLoosePoints;
          else return scale.prismAttackLoosePoints;
        }
        case PvpGameResult.DefWin: {
          if (isBigOpponent) return scale.bigPrismDefWinPoints;
          else return scale.prismDefWinPoints;
        }
        case PvpGameResult.DefLoose: {
          if (isBigOpponent) return scale.bigPrismDefLoosePoints;
          else return scale.prismDefLoosePoints;
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
      if (result === PvpGameResult.AvaWin) return scale.avaWin;
      return scale.avaLoose;
    }
  }
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
  '/:gameId',
  checkPermissions('read:pvp-games'),
  async (req: Request, res: Response) => {
    try {
      const gameId = req.params.gameId;
      if (!gameId)
        return res.status(400).send({ message: 'GameId nécessaire' });

      const game = await prisma.pvpGame.findUnique({
        where: {
          id: Number(gameId),
        },
      });
      return res.status(200).send(game);
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

      let game: PvpGame;
      if (getRuntimeEnv() === RuntimeEnv.Influ) {
        const client = getManagementClient('read:users read:user_idp_tokens');
        const t = await client.getUser({ id: body.player1 });
        console.log(t);
        game = await prisma.pvpGame.create({
          data: {
            requester: body.requester,
            status: PvpGameStatus.Pending,
            periodId: currentPeriod.id,
            player1: body.player1,
            player1Name: (await client.getUser({ id: body.player1 })).name,
            player2: body.player2,
            player2Name: body.player2
              ? (
                  await client.getUser({ id: body.player2 })
                ).name
              : null,
            player3: body.player3,
            player3Name: body.player3
              ? (
                  await client.getUser({ id: body.player3 })
                ).name
              : null,
            player4: body.player4,
            player4Name: body.player4
              ? (
                  await client.getUser({ id: body.player4 })
                ).name
              : null,
            player5: body.player5,
            player5Name: body.player5
              ? (
                  await client.getUser({ id: body.player5 })
                ).name
              : null,
            result: body.result,
            type: body.type,
            screenshotUrl: body.screenshotUrl,
            timestamp: new Date().toISOString(),
            gamePoints: 0,
          },
        });
      } else {
        game = await prisma.pvpGame.create({
          data: {
            requester: body.requester,
            status: PvpGameStatus.Pending,
            periodId: currentPeriod.id,
            player1: body.player1,
            player1Name: body.player1Name,
            player2: body.player2,
            player2Name: body.player2Name,
            player3: body.player3,
            player3Name: body.player3Name,
            player4: body.player4,
            player4Name: body.player4Name,
            player5: body.player5,
            player5Name: body.player5Name,
            result: body.result,
            type: body.type,
            screenshotUrl: body.screenshotUrl,
            timestamp: new Date().toISOString(),
            gamePoints: 0,
          },
        });
      }

      return res.status(201).send(game);
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
      const gameId = req.params.gameId;
      if (!gameId)
        return res.status(400).send({ message: 'GameId nécessaire' });

      const { status } = req.body;
      if (status === null || status === undefined)
        return res.status(400).send({ message: 'Status manquant' });

      const scale = await prisma.scale.findFirst({
        where: {
          id: 1,
        },
      });
      const game = await prisma.pvpGame.findFirst({
        where: {
          id: Number(gameId),
        },
      });
      if (!scale || !game)
        return res.status(400).send({ message: 'Scale ou game introuvable' });

      const gamePoints = getGameInitialPoints(
        scale,
        game.type,
        game.result,
        req.body.isBigOpponent,
      );
      await prisma.pvpGame.update({
        where: {
          id: Number(gameId),
        },
        data: {
          status,
          gamePoints,
          bigOpponent: req.body.isBigOpponent,
        },
      });

      const gamePlayers = [game.player1];
      if (game.player2) gamePlayers.push(game.player2);
      if (game.player3) gamePlayers.push(game.player3);
      if (game.player4) gamePlayers.push(game.player4);
      if (game.player5) gamePlayers.push(game.player5);
      for (const player of gamePlayers) {
        await prisma.playerPeriod.upsert({
          where: {
            playerId_periodId: {
              periodId: game.periodId,
              playerId: player,
            },
          },
          create: {
            periodId: game.periodId,
            playerId: player,
            totalPoints: gamePoints,
          },
          update: {
            periodId: game.periodId,
            playerId: player,
            totalPoints: {
              increment: gamePoints,
            },
          },
        });
      }

      return res.status(200).send({});
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

      const game = await prisma.pvpGame.findUnique({
        where: {
          id: Number(gameId),
        },
      });
      if (!game)
        return res.status(400).send({ message: 'Partie PVP non trouvée' });

      const gamePlayers = [game.player1];
      if (game.player2) gamePlayers.push(game.player2);
      if (game.player3) gamePlayers.push(game.player3);
      if (game.player4) gamePlayers.push(game.player4);
      if (game.player5) gamePlayers.push(game.player5);
      for (const player of gamePlayers) {
        await prisma.playerPeriod.update({
          where: {
            playerId_periodId: {
              periodId: game.periodId,
              playerId: player,
            },
          },
          data: {
            totalPoints: {
              decrement: game.gamePoints,
            },
          },
        });
      }

      await prisma.pvpGame.delete({
        where: {
          id: Number(gameId),
        },
      });
      return res.status(200).send({});
    } catch (e) {
      return res.status(500).send(e);
    }
  },
);

export { pvpGamesRouter };
