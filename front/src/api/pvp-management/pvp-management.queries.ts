import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { Period, PvpGame, Scale } from '@Models/pvp-management.models';

export enum PvpManagementQueriesKeys {
  Periods = 'Periods',
  Scale = 'Scale',
  Games = 'Games',
}

export function usePeriods() {
  const { get } = useApi();

  return useQuery([PvpManagementQueriesKeys.Periods], () =>
    get<Period[]>(`/periods`),
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

export function useGames() {
  const { get } = useApi();

  return useQuery([PvpManagementQueriesKeys.Games], () =>
    get<PvpGame[]>('/pvp-games'),
  );
}
