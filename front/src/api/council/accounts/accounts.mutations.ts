import { useMutation, useQueryClient } from 'react-query';
import { useApi } from '@Hooks/api';
import { AccountsQueriesKey } from '@Api/council/accounts/accounts.queries';

export function useDeleteAccount() {
  const { del } = useApi();
  const queryClient = useQueryClient();

  return useMutation((accountId: string) => del(`/accounts/${accountId}`), {
    onSuccess: async () => {
      await queryClient.refetchQueries(AccountsQueriesKey.Accounts);
    },
  });
}
