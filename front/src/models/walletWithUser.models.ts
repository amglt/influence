import { User } from './root.models';

export type WalletWithUser = {
  id: number;
  influcoinBalance: number;
  userId: string;
  user: User;
};
