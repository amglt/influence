import { Router, Request, Response } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';
import { Scale } from '@prisma/client';

export enum PvpGameResult {
  AttackWin,
  AttackLoose,
  DefWin,
  DefLoose,
  AvaWin,
  AvaLoose,
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

      const game = await prisma.pvpGame.create({
        data: {
          requester: body.requester,
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
          gamePoints: 0,
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
