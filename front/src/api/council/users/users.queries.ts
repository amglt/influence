import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { User } from '@Models/root.models';

export enum UsersQueriesKey {
  Users = 'Users',
}

export function useUsers() {
  const { get } = useApi();

  return useQuery(UsersQueriesKey.Users, () => get<User[]>('/users'));
}
