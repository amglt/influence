import { useMutation, useQueryClient } from 'react-query';
import { useApi } from '@Hooks/api';
import { AccountsQueriesKey } from '@Api/recruitment/accounts/accounts.queries';

export function useDeleteAccount() {
  const { del } = useApi();
  const queryClient = useQueryClient();

  return useMutation((accountId: number) => del(`/accounts/${accountId}`), {
    onSuccess: async () => {
      await queryClient.refetchQueries(AccountsQueriesKey.Accounts);
    },
  });
}

export function useAddAccount() {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    (body: { name: string; userId: string }) => post(`/accounts`, body),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(AccountsQueriesKey.Accounts);
      },
    },
  );
}

export function useEditAccount() {
  const { put } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    (request: { id: number; body: { name: string; userId: string } }) =>
      put(`/accounts/${request.id}`, { ...request.body }),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(AccountsQueriesKey.Accounts);
      },
    },
  );
}