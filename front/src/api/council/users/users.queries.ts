import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { User, UserWithRole } from '@Models/root.models';
import { FormInstance } from 'antd';

export enum UsersQueriesKey {
  Users = 'Users',
  User = 'User',
}

export function useUsers() {
  const { get } = useApi();

  return useQuery(UsersQueriesKey.Users, () => get<User[]>('/users'));
}

export function useUser(id?: string, form?: FormInstance) {
  const { get } = useApi();

  return useQuery(
    [UsersQueriesKey.User, id],
    () => get<UserWithRole>(`/users/${id}`),
    {
      enabled: !!id,
      onSuccess: (data) => {
        if (form) {
          form.setFieldsValue({
            name: data.name,
            role: data.role?.id,
          });
        }
      },
    },
  );
}
