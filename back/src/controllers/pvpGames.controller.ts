import { Request, Response, Router } from 'express';
import { checkPermissions } from '../middlewares/permission.middleware';
import { prisma } from '../db';
import { Scale, PvpGame } from '@prisma/client';
import {
  PvpGameResult,
  PvpGameStatus,
  PvpGameType,
} from '../models/pvpGames.models';

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
          if (isBigOpponent) return scale.bigPrismNDPoints;
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
      return res.status(500).send({ message: e });
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

      return game
        ? res.status(200).send(game)
        : res
            .status(400)
            .send({ message: 'Aucune partie trouvée avec cet ID' });
    } catch (e) {
      return res.status(500).send({ message: e });
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
      game = await prisma.pvpGame.create({
        data: {
          requester: body.requester,
          status: PvpGameStatus.Pending,
          periodId: currentPeriod.id,
          player1Id: body.player1,
          player2Id: body.player2,
          player3Id: body.player3,
          player4Id: body.player4,
          player5Id: body.player5,
          result: body.result,
          type: body.type,
          screenshotUrl: body.screenshotUrl,
          timestamp: new Date().toISOString(),
          gamePoints: 0,
        },
      });

      return res.status(201).send(game);
    } catch (e) {
      return res.status(500).send({ message: e });
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

      const gamePlayers = [game.player1Id];
      if (game.player2Id) gamePlayers.push(game.player2Id);
      if (game.player3Id) gamePlayers.push(game.player3Id);
      if (game.player4Id) gamePlayers.push(game.player4Id);
      if (game.player5Id) gamePlayers.push(game.player5Id);
      for (const player of gamePlayers) {
        if (
          game.status !== PvpGameStatus.Accepted &&
          status === PvpGameStatus.Accepted
        ) {
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
            },
            update: {},
          });
        } else if (
          game.status === PvpGameStatus.Accepted &&
          status !== PvpGameStatus.Accepted
        ) {
          await prisma.pvpGame.update({
            where: {
              id: Number(gameId),
            },
            data: {
              status,
              gamePoints: 0,
              bigOpponent: req.body.isBigOpponent,
            },
          });
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
            },
            update: {},
          });
        } else if (
          game.status === PvpGameStatus.Accepted &&
          status === PvpGameStatus.Accepted
        ) {
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
        } else {
          await prisma.pvpGame.update({
            where: {
              id: Number(gameId),
            },
            data: {
              status,
              gamePoints: 0,
              bigOpponent: req.body.isBigOpponent,
            },
          });
        }
      }

      return res.status(200).send({});
    } catch (e) {
      return res.status(500).send({ message: e });
    }
  },
);

pvpGamesRouter.get(
  '/:userId/stats',
  checkPermissions('read:pvp-games'),
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!userId) return res.status(400).send({ message: 'userId manquant' });

      const currentPeriod = await prisma.period.findFirst({
        where: {
          endDate: null,
        },
      });
      if (!currentPeriod)
        return res.status(400).send({ message: 'Pas de période active' });

      const games = await prisma.pvpGame.findMany({
        where: {
          AND: [
            {
              OR: [
                { player1Id: Number(userId) },
                { player2Id: Number(userId) },
                { player3Id: Number(userId) },
                { player4Id: Number(userId) },
                { player5Id: Number(userId) },
              ],
            },
            {
              periodId: currentPeriod.id,
              status: PvpGameStatus.Accepted,
            },
          ],
        },
      });
      const totalPoints = Number(
        games
          .reduce(
            (previousValue, currentValue) =>
              previousValue + Number(currentValue.gamePoints),
            0,
          )
          .toFixed(2),
      );

      const stats =
        games.length > 0
          ? {
              totalPoints: totalPoints,
              totalGames: games.length,
              gamesStats: {
                wonGames: games.filter(
                  (game) =>
                    game.result === PvpGameResult.AvaWin ||
                    game.result === PvpGameResult.DefWin ||
                    game.result === PvpGameResult.AttackWin,
                ).length,
                lostGames: games.filter(
                  (game) =>
                    game.result === PvpGameResult.AvaLoose ||
                    game.result === PvpGameResult.DefLoose ||
                    game.result === PvpGameResult.AttackLoose,
                ).length,
                noDefGames: games.filter(
                  (game) => game.result === PvpGameResult.ND,
                ).length,
                percoGames: games.filter(
                  (game) => game.type === PvpGameType.Perco,
                ).length,
                prismGames: games.filter(
                  (game) => game.type === PvpGameType.Prism,
                ).length,
                avaGames: games.filter((game) => game.type === PvpGameType.AvA)
                  .length,
                percoAttackWon: games.filter(
                  (game) =>
                    game.type === PvpGameType.Perco &&
                    game.result === PvpGameResult.AttackWin,
                ).length,
                percoAttackLost: games.filter(
                  (game) =>
                    game.type === PvpGameType.Perco &&
                    game.result === PvpGameResult.AttackLoose,
                ).length,
                percoDefWon: games.filter(
                  (game) =>
                    game.type === PvpGameType.Perco &&
                    game.result === PvpGameResult.DefWin,
                ).length,
                percoDefLost: games.filter(
                  (game) =>
                    game.type === PvpGameType.Perco &&
                    game.result === PvpGameResult.DefLoose,
                ).length,
                percoNoDef: games.filter(
                  (game) =>
                    game.type === PvpGameType.Perco &&
                    game.result === PvpGameResult.ND,
                ).length,
                prismAttackWon: games.filter(
                  (game) =>
                    game.type === PvpGameType.Prism &&
                    game.result === PvpGameResult.AttackWin,
                ).length,
                prismAttackLost: games.filter(
                  (game) =>
                    game.type === PvpGameType.Prism &&
                    game.result === PvpGameResult.AttackLoose,
                ).length,
                prismDefWon: games.filter(
                  (game) =>
                    game.type === PvpGameType.Prism &&
                    game.result === PvpGameResult.DefWin,
                ).length,
                prismDefLost: games.filter(
                  (game) =>
                    game.type === PvpGameType.Prism &&
                    game.result === PvpGameResult.DefLoose,
                ).length,
                prismNoDef: games.filter(
                  (game) =>
                    game.type === PvpGameType.Prism &&
                    game.result === PvpGameResult.ND,
                ).length,
                avaWon: games.filter(
                  (game) =>
                    game.type === PvpGameType.AvA &&
                    game.result === PvpGameResult.AvaWin,
                ).length,
                avaLost: games.filter(
                  (game) =>
                    game.type === PvpGameType.AvA &&
                    game.result === PvpGameResult.AvaLoose,
                ).length,
              },
            }
          : {
              totalPoints: 0,
              totalGames: 0,
              gamesStats: {},
            };
      return res.status(200).send(stats);
    } catch (err) {
      return res.status(500).send({ message: err });
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
      return res.status(500).send({ message: e });
    }
  },
);

export { pvpGamesRouter };
