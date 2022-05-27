import type { User } from './users.models';

export interface Account {
  id: number;
  name: string;
  userId: string;
  isDeleted: boolean;
}

export interface AccountWithUser extends Account {
  user: User;
}
