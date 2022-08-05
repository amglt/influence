import { ApiError } from '@Models/root.models';
import { PvpGame } from '@Models/pvp-management.models';

export function isApiError(err: ApiError | unknown): err is ApiError {
  return (err as ApiError).message !== undefined;
}

export function getPlayersStringFromPvpGame(game: PvpGame) {
  let players = game.player1Name;
  if (game.player2Name) players += `, ${game.player2Name}`;
  if (game.player3Name) players += `, ${game.player3Name}`;
  if (game.player4Name) players += `, ${game.player4Name}`;
  if (game.player5Name) players += `, ${game.player5Name}`;
  return players;
}
