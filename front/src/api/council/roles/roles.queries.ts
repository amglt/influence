import { useQuery } from 'react-query';
import { FormInstance } from 'antd';
import { useApi } from '../../../hooks/api';
import {
  Permission,
  Role,
  RoleWithPermissions,
} from '../../../models/root.models';

export enum RolesQueriesKey {
  Roles = 'Roles',
  Role = 'Role',
  Permissions = 'Permissions',
}

export function useRoles() {
  const { get } = useApi();

  return useQuery(RolesQueriesKey.Roles, () =>
    get<Role[]>('/management/roles'),
  );
}

export function useRole(id?: string, form?: FormInstance) {
  const { get } = useApi();

  return useQuery(
    [RolesQueriesKey.Role, id],
    () => get<RoleWithPermissions>(`/management/roles/${id}`),
    {
      enabled: !!id,
      onSuccess: (data) => {
        form?.setFieldsValue({
          name: data.name,
          permissions: data.permissions.map((p) => p.id),
        });
      },
    },
  );
}

export function usePermissions() {
  const { get } = useApi();

  return useQuery(RolesQueriesKey.Permissions, () =>
    get<Permission[]>('/management/permissions'),
  );
}
