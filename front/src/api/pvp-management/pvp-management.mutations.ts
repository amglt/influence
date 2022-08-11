import { useApi } from '@Hooks/api';
import { useMutation, useQueryClient } from 'react-query';
import { PvpManagementQueriesKeys } from '@Api/pvp-management/pvp-management.queries';
import { PvpGameStatus, Scale } from '@Models/pvp-management.models';
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

export function useEditPeriodReward() {
  const { patch } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    (request: { periodId: number; reward: number }) =>
      patch(`/periods/${request.periodId}/reward`, { reward: request.reward }),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(PvpManagementQueriesKeys.Periods);
        notification.success({
          placement: 'bottomRight',
          message: 'Période correctement editée',
        });
      },
    },
  );
}

export function useEditPeriodRewarded() {
  const { patch } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    (request: { periodId: number; playerId: number; rewarded: boolean }) =>
      patch(`/periods/reward-paiement`, request),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(
          PvpManagementQueriesKeys.PeriodPlayers,
        );
        notification.success({
          placement: 'bottomRight',
          message: 'Joueur payé',
        });
      },
    },
  );
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

export function useEditGame(onSuccess?: () => void) {
  const { put } = useApi();

  return useMutation(
    (request: {
      gameId: number;
      status: PvpGameStatus;
      isBigOpponent: boolean;
    }) =>
      put(`/pvp-games/${request.gameId}`, {
        status: request.status,
        isBigOpponent: request.isBigOpponent,
      }),
    {
      onSuccess: async () => {
        if (onSuccess) await onSuccess();
        notification.success({
          placement: 'bottomRight',
          message: 'Partie correctement mise à jour',
        });
      },
    },
  );
}

export function useDeleteGame(onSuccess?: () => void) {
  const { del } = useApi();

  return useMutation((gameId: number) => del(`/pvp-games/${gameId}`), {
    onSuccess: async () => {
      if (onSuccess) await onSuccess();
      notification.success({
        placement: 'bottomRight',
        message: 'Partie correctement supprimée',
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
