import { useMutation, useQueryClient } from 'react-query';
import { notification } from 'antd';
import { useApi } from '../../../hooks/api';
import { Role } from '../../../models/root.models';
import { UsersQueriesKeys } from './users.queries';

export function useEditUser() {
  const { put } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    (request: { userId: number; body: { role: Role } }) =>
      put(`/users/${request.userId}/role`, { ...request.body }),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries([UsersQueriesKeys.Users]);
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

  return useMutation((id: number) => del(`/users/${id}`), {
    onSuccess: () => queryClient.refetchQueries([UsersQueriesKeys.Users]),
  });
}
