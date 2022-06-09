import { useMutation, useQueryClient } from 'react-query';
import { useApi } from '@Hooks/api';
import { RolesQueriesKey } from '@Api/council/roles/roles.queries';
import { Permission } from '@Models/root.models';

export function useDeleteRole() {
  const { del } = useApi();
  const queryClient = useQueryClient();

  return useMutation((roleId: string) => del(`/management/roles/${roleId}`), {
    onSuccess: async () => {
      await queryClient.refetchQueries(RolesQueriesKey.Roles);
    },
  });
}

export function useAddRole() {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    (body: { name: string; description: string; permissions: Permission[] }) =>
      post(`/management/roles`, body),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(RolesQueriesKey.Roles);
      },
    },
  );
}
