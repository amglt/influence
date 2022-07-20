import { User } from './root.models';

export type Wallet = {
  id: number;
  influcoinBalance: number;
  userId: string;
};

export type WalletWithUser = {
  id: number;
  influcoinBalance: number;
  userId: string;
  user: User;
};

export type WalletRecord = {
  id: number;
  amount: number;
  walletIdFrom: number;
  walletIdTo: number;
};

export type WalletRecordWithUsers = {
  id: number;
  amount: number;
  walletIdFrom?: number;
  walletIdTo?: number;
  userFrom?: User;
  userTo?: User;
};
