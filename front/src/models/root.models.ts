export const enum AppPermissions {
  BanUser = 'ban:users',
  DeletePeriods = 'delete:periods',
  DeletePVPGames = 'delete:pvp-games',
  DeleteUser = 'delete:users',
  IsAdmin = 'is:admin',
  IsCouncil = 'is:council',
  IsLogistic = 'is:logistic',
  IsMember = 'is:member',
  IsPVP = 'is:pvp',
  IsRecruitment = 'is:recruitment',
  ReadPeriods = 'read:periods',
  ReadScale = 'read:scale',
  WritePeriods = 'write:periods',
  WritePVPGames = 'write:pvp-games',
  WriteScale = 'write:scale',
}

export type ApiError = {
  message: string;
  description?: string;
};

export type Permission = {
  permission_name: string;
  resource_server_identifier: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
};

export type RoleWithPermissions = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
};

export type Identity = {
  provider: string;
  access_token: string;
  refresh_token: string;
  user_id: string;
  connection: string;
  isSocial: boolean;
};

export interface User {
  created_at: Date;
  identities: Identity[];
  name: string;
  nickname: string;
  picture: string;
  updated_at: Date;
  user_id: string;
  last_login: Date;
  last_ip: string;
  logins_count: number;
  blocked: boolean;
}

export interface UserWithRole extends User {
  role?: Role;
}

export interface AppUser extends User {
  role?: Role;
  permissions: string[];
}
