import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { Permission, Role, RoleWithPermissions } from '@Models/root.models';
import { FormInstance } from 'antd';

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
          description: data.description,
          permissions: data.permissions.map((perm) => perm.permission_name),
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
