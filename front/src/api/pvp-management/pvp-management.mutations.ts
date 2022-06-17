import { useApi } from '@Hooks/api';
import { useMutation, useQueryClient } from 'react-query';
import { PvpManagementQueriesKeys } from '@Api/pvp-management/pvp-management.queries';

export function useDeletePeriod() {
  const { del } = useApi();
  const queryClient = useQueryClient();

  return useMutation((periodId: number) => del(`/periods/${periodId}`), {
    onSuccess: async () => {
      await queryClient.refetchQueries(PvpManagementQueriesKeys.Periods);
    },
  });
}

export function useCreatePeriod() {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(() => post(`/periods`), {
    onSuccess: async () => {
      await queryClient.refetchQueries(PvpManagementQueriesKeys.Periods);
    },
  });
}
