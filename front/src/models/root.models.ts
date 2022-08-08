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
  id: number;
  name: string;
};

export type Role = {
  id: string;
  name: string;
};

export type RoleWithPermissions = {
  id: string;
  name: string;
  permissions: Permission[];
};

export interface User {
  created_at: Date;
  username: string;
  nickname: string;
  picture: string;
  guild: string;
  updated_at: Date;
  id: number;
  blocked: boolean;
  roleId?: number;
}

export interface UserWithRole extends User {
  role?: Role;
}

export interface AppUser extends User {
  role?: Role;
  permissions: string[];
}
