import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { Role } from '@Models/root.models';

export enum RolesQueriesKey {
  Roles = 'Roles',
}

export function useRoles() {
  const { get } = useApi();

  return useQuery(RolesQueriesKey.Roles, () =>
    get<Role[]>('/management/roles'),
  );
}
