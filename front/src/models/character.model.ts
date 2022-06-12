import { Account } from './account.models';

export type Character = {
  id: number;
  name: string;
  class: string;
  rank: string;
  account: Account;
  recruitmentDate: Date;
};
