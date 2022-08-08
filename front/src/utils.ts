import { ApiError } from '@Models/root.models';
import { PvpGameWithPlayers } from '@Models/pvp-management.models';
import { format as fnsFormat, utcToZonedTime } from 'date-fns-tz';
import fr from 'date-fns/locale/fr';

export function isApiError(err: ApiError | unknown): err is ApiError {
  return (err as ApiError).message !== undefined;
}

export function getPlayersStringFromPvpGame(game: PvpGameWithPlayers) {
  let players = game.player1.nickname;
  if (game.player2) players += `, ${game.player2.nickname}`;
  if (game.player3) players += `, ${game.player3.nickname}`;
  if (game.player4) players += `, ${game.player4.nickname}`;
  if (game.player5) players += `, ${game.player5.nickname}`;
  return players;
}

export const format = (date: Date) => {
  const zonedTime = utcToZonedTime(date, 'Europe/Paris');
  return fnsFormat(zonedTime, 'dd/MM/yyyy HH:mm:ss', {
    timeZone: 'Europe/Paris',
    locale: fr,
  });
};
