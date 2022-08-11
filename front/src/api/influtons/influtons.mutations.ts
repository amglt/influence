import { useMutation, useQueryClient } from 'react-query';
import { notification } from 'antd';
import { useApi } from '../../hooks/api';
import { useSelector } from '../../store';
import { InflutonQueriesKeys } from './influtons.queries';

export function useCreateWalletTransaction() {
  const { post } = useApi();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.root);

  return useMutation(
    (request: { walletFromId?: number; walletToId: number; amount: number }) =>
      post(`/wallets/transaction`, { ...request, requesterId: user.id }),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(InflutonQueriesKeys.Wallets);
        notification.success({
          placement: 'bottomRight',
          message: 'Influtons envoyés',
        });
      },
    },
  );
}
