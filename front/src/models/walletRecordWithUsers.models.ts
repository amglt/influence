import { User } from '@Models/root.models';
export type WalletRecordWithUsers = {
  id: number;
  amount: number;
  walletIdFrom: number;
  walletIdTo: number;
  userFrom: User;
  userTo: User;
};
