import { useApi } from '@Hooks/api';
import { useMutation, useQueryClient } from 'react-query';
import { PvpManagementQueriesKeys } from '@Api/pvp-management/pvp-management.queries';
import { Scale } from '@Models/pvp-management.models';
import { notification } from 'antd';

export function useDeletePeriod() {
  const { del } = useApi();
  const queryClient = useQueryClient();

  return useMutation((periodId: number) => del(`/periods/${periodId}`), {
    onSuccess: async () => {
      await queryClient.refetchQueries(PvpManagementQueriesKeys.Periods);
      notification.success({
        placement: 'bottomRight',
        message: 'Période correctement supprimée',
      });
    },
  });
}

export function useCreatePeriod() {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(() => post(`/periods`), {
    onSuccess: async () => {
      await queryClient.refetchQueries(PvpManagementQueriesKeys.Periods);
      notification.success({
        placement: 'bottomRight',
        message: 'Période correctement créée',
      });
    },
  });
}

export function useSaveScale() {
  const { put } = useApi();
  const queryClient = useQueryClient();

  return useMutation((scale: Scale) => put(`/scale`, scale), {
    onSuccess: async () => {
      await queryClient.refetchQueries(PvpManagementQueriesKeys.Scale);
      notification.success({
        placement: 'bottomRight',
        message: 'Barème correctement mis à jour',
      });
    },
  });
}
