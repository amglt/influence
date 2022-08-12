import { useMutation, useQueryClient } from 'react-query';
import { notification } from 'antd';
import { useApi } from '../../../hooks/api';
import { RolesQueriesKey } from './roles.queries';
import { Permission } from '../../../models/root.models';

export function useDeleteRole() {
  const { del } = useApi();
  const queryClient = useQueryClient();

  return useMutation((roleId: string) => del(`/management/roles/${roleId}`), {
    onSuccess: async () => {
      await queryClient.refetchQueries(RolesQueriesKey.Roles);
      notification.open({
        type: 'success',
        message: `Le role a bien été supprimé`,
        placement: 'bottomRight',
      });
    },
  });
}

export function useAddRole() {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    (body: { name: string; permissions: Permission[] }) =>
      post(`/management/roles`, body),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(RolesQueriesKey.Roles);
        notification.open({
          type: 'success',
          message: `Le role a bien été créé`,
          placement: 'bottomRight',
        });
      },
    },
  );
}

export function useEditRole() {
  const { patch } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    (request: {
      id: string;
      body: { name: string; permissions: Permission[] };
    }) => patch(`/management/roles/${request.id}`, { ...request.body }),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(RolesQueriesKey.Roles);
        notification.open({
          type: 'success',
          message: `Le role a bien été mise à jour`,
          placement: 'bottomRight',
        });
      },
    },
  );
}
