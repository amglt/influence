import { ApiError } from '@Models/root.models';
import { PvpGame } from '@Models/pvp-management.models';

export function isApiError(err: ApiError | unknown): err is ApiError {
  return (err as ApiError).message !== undefined;
}

export function getPlayersStringFromPvpGame(game: PvpGame) {
  let players = game.player1;
  if (game.player2) players += `, ${game.player2}`;
  if (game.player3) players += `, ${game.player3}`;
  if (game.player4) players += `, ${game.player4}`;
  if (game.player5) players += `, ${game.player5}`;
  return players;
}
