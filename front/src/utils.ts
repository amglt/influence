import { ApiError } from '@Models/root.models';
import { PvpGame } from '@Models/pvp-management.models';
import { format as fnsFormat, utcToZonedTime } from 'date-fns-tz';
import fr from 'date-fns/locale/fr';

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

export const format = (date: Date) => {
  const zonedTime = utcToZonedTime(date, 'Europe/Paris');
  return fnsFormat(zonedTime, 'dd/MM/yyyy HH:mm:ss', {
    timeZone: 'Europe/Paris',
    locale: fr,
  });
};
