import { User } from './root.models';

export type Wallet = {
  id: number;
  balance: number;
  user: User;
};

export type Transaction = {
  id: number;
  walletFrom?: Wallet;
  walletTo?: Wallet;
  requester: User;
  createdAt: Date;
};
