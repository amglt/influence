import { useQuery } from 'react-query';
import { FormInstance } from 'antd';
import { useApi } from '../../../hooks/api';
import { User, UserWithRole } from '../../../models/root.models';

export enum UsersQueriesKeys {
  Users = 'Users',
  User = 'User',
}

export function useUsers() {
  const { get } = useApi();

  return useQuery(UsersQueriesKeys.Users, () => get<User[]>('/users'));
}

export function useUser(id?: number, form?: FormInstance) {
  const { get } = useApi();

  return useQuery(
    [UsersQueriesKeys.User, id],
    () => get<UserWithRole>(`/users/${id}`),
    {
      enabled: !!id,
      onSuccess: (data) => {
        if (form) {
          form.setFieldsValue({
            name: data.username,
            role: data.role?.id,
          });
        }
      },
    },
  );
}
