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
      if (getRuntimeEnv() === RuntimeEnv.Influ) {
        const client = getManagementClient('read:users read:user_idp_tokens');
        game = await prisma.pvpGame.create({
          data: {
            requester: body.requester,
            status: PvpGameStatus.Pending,
            periodId: currentPeriod.id,
            player1: body.player1,
            player1Name: (await client.getUser({ id: body.player1 })).name,
            player1Guild: body.player1Guild,
            player2: body.player2,
            player2Name: body.player2
              ? (
                  await client.getUser({ id: body.player2 })
                ).name
              : null,
            player2Guild: body.player2Guild,
            player3: body.player3,
            player3Name: body.player3
              ? (
                  await client.getUser({ id: body.player3 })
                ).name
              : null,
            player3Guild: body.player3Guild,
            player4: body.player4,
            player4Name: body.player4
              ? (
                  await client.getUser({ id: body.player4 })
                ).name
              : null,
            player4Guild: body.player4Guild,
            player5: body.player5,
            player5Name: body.player5
              ? (
                  await client.getUser({ id: body.player5 })
                ).name
              : null,
            player5Guild: body.player5Guild,
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
            player1Guild: body.player1Guild,
            player2: body.player2,
            player2Name: body.player2Name,
            player2Guild: body.player2Guild,
            player3: body.player3,
            player3Name: body.player3Name,
            player3Guild: body.player3Guild,
            player4: body.player4,
            player4Name: body.player4Name,
            player4Guild: body.player4Guild,
            player5: body.player5,
            player5Name: body.player5Name,
            player5Guild: body.player5Guild,
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

      if (status === PvpGameStatus.Accepted) {
        const gamePlayers = [
          {
            id: game.player1,
            name: game.player1Name,
            guild: game.player1Guild,
          },
        ];
        if (game.player2 && game.player2Name && game.player2Guild)
          gamePlayers.push({
            id: game.player2,
            name: game.player2Name,
            guild: game.player2Guild,
          });
        if (game.player3 && game.player3Name && game.player3Guild)
          gamePlayers.push({
            id: game.player3,
            name: game.player3Name,
            guild: game.player3Guild,
          });
        if (game.player4 && game.player4Name && game.player4Guild)
          gamePlayers.push({
            id: game.player4,
            name: game.player4Name,
            guild: game.player4Guild,
          });
        if (game.player5 && game.player5Name && game.player5Guild)
          gamePlayers.push({
            id: game.player5,
            name: game.player5Name,
            guild: game.player5Guild,
          });
        for (const player of gamePlayers) {
          await prisma.playerPeriod.upsert({
            where: {
              playerId_periodId: {
                periodId: game.periodId,
                playerId: player.id,
              },
            },
            create: {
              periodId: game.periodId,
              playerId: player.id,
              playerName: player.name,
              playerGuild: player.guild,
              totalPoints: gamePoints,
            },
            update: {
              totalPoints: {
                increment: gamePoints,
              },
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
                { player1: userId },
                { player2: userId },
                { player3: userId },
                { player4: userId },
                { player5: userId },
              ],
            },
            {
              periodId: currentPeriod.id,
              status: PvpGameStatus.Accepted,
            },
          ],
        },
      });

      const stats =
        games.length > 0
          ? {
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

      const gamePlayers = [game.player1];
      if (game.player2) gamePlayers.push(game.player2);
      if (game.player3) gamePlayers.push(game.player3);
      if (game.player4) gamePlayers.push(game.player4);
      if (game.player5) gamePlayers.push(game.player5);
      for (const player of gamePlayers) {
        const playerPeriod = await prisma.playerPeriod.findUnique({
          where: {
            playerId_periodId: {
              periodId: game.periodId,
              playerId: player,
            },
          },
        });
        if (playerPeriod) {
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
      }

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
