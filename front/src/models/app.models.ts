export const enum AppPermissions {
  IsCouncil = 'is:council',
  IsAdmin = 'is:admin',
  IsMember = 'is:member',
  IsRecruitment = 'is:recruitment',
  DeleteUser = 'delete:users',
  BanUser = 'ban:users',
  DeleteAccount = 'delete:accounts',
  WriteUser = 'write:users',
}

export type Permission = {
  permission_name: string;
  resource_server_identifier: string;
};

export type PermissionWithChecked = {
  permission_name: string;
  resource_server_identifier: string;
  checked: boolean;
};

export type RoleWithPermissions = {
  name: string;
  description: string;
  permissions: Permission[];
};
