import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import {
  Period,
  PeriodPlayerPoints,
  PvpGameWithPlayers,
  Scale,
} from '@Models/pvp-management.models';

export enum PvpManagementQueriesKeys {
  Periods = 'Periods',
  PeriodGames = 'PeriodGames',
  PeriodPlayers = 'PeriodPlayers',
  PeriodPlayerGames = 'PeriodPlayerGames',
  Scale = 'Scale',
  Games = 'Games',
}

export function usePeriods() {
  const { get } = useApi();

  return useQuery([PvpManagementQueriesKeys.Periods], () =>
    get<Period[]>(`/periods`),
  );
}

export function usePeriodGames(periodId?: string) {
  const { get } = useApi();

  return useQuery(
    [PvpManagementQueriesKeys.PeriodGames],
    () => get<{ games: PvpGameWithPlayers[] }>(`/periods/${periodId}/games`),
    {
      enabled: !!periodId,
    },
  );
}

export function usePeriodPlayers(periodId?: string) {
  const { get } = useApi();

  return useQuery(
    [PvpManagementQueriesKeys.PeriodPlayers],
    () => get<PeriodPlayerPoints[]>(`/periods/${periodId}/players`),
    {
      enabled: !!periodId,
    },
  );
}

export function usePeriodPlayerGames(periodId?: string, playerId?: string) {
  const { get } = useApi();

  return useQuery(
    [PvpManagementQueriesKeys.PeriodPlayerGames],
    () => get<PvpGameWithPlayers[]>(`/periods/${periodId}/games/${playerId}`),
    {
      enabled: !!periodId && !!playerId,
    },
  );
}

export function useScale(onSuccess?: (data: Scale) => void) {
  const { get } = useApi();

  return useQuery(
    [PvpManagementQueriesKeys.Scale],
    () => get<Scale>(`/scale`),
    {
      onSuccess,
    },
  );
}
