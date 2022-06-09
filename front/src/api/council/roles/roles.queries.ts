import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { Permission, Role } from '@Models/root.models';

export enum RolesQueriesKey {
  Roles = 'Roles',
  Permissions = 'Permissions',
}

export function useRoles() {
  const { get } = useApi();

  return useQuery(RolesQueriesKey.Roles, () =>
    get<Role[]>('/management/roles'),
  );
}

export function usePermissions() {
  const { get } = useApi();

  return useQuery(RolesQueriesKey.Permissions, () =>
    get<Permission[]>('/management/permissions'),
  );
}
