import { useMutation, useQueryClient } from 'react-query';
import { useApi } from '@Hooks/api';
import { UsersQueriesKey } from '@Api/council/users/users.queries';
import { Role } from '@Models/root.models';
import { notification } from 'antd';

export function useEditUser() {
  const { put } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    (request: { userId: string; body: { role: Role } }) =>
      put(`/users/${request.userId}`, { ...request.body }),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries([UsersQueriesKey.Users]);
        notification.open({
          type: 'success',
          message: `L'utilisateur a bien été modifié`,
          placement: 'bottomRight',
        });
      },
    },
  );
}

export function useDeleteUser() {
  const { del } = useApi();
  const queryClient = useQueryClient();

  return useMutation((id: string) => del(`/users/${id}`), {
    onSuccess: () => queryClient.refetchQueries([UsersQueriesKey.Users]),
  });
}
