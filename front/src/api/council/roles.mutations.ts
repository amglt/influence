import { useMutation, useQueryClient } from 'react-query';
import { useApi } from '@Hooks/api';
import { RolesQueriesKey } from '@Api/council/roles.queries';

export function useDeleteRole() {
  const { del } = useApi();
  const queryClient = useQueryClient();

  return useMutation((roleId: string) => del(`/management/roles/${roleId}`), {
    onSuccess: async () => {
      await queryClient.refetchQueries(RolesQueriesKey.Roles);
    },
  });
}
