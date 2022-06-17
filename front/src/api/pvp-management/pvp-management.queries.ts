import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { Period } from '@Models/pvp-management.models';

export enum PvpManagementQueriesKeys {
  Periods = 'Periods',
}

export function usePeriods() {
  const { get } = useApi();

  return useQuery([PvpManagementQueriesKeys.Periods], () =>
    get<Period[]>(`/periods`),
  );
}
