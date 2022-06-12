import { Account } from './account.model';

export type Character = {
  id: number;
  name: string;
  class: string;
  rank: string;
  account: Account;
  accountId: number;
  discordTag: string;
  recruitmentDate: Date;
};
