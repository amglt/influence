import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { Account } from '@Models/account.model';

export enum AccountsQueriesKey {
  Accounts = 'Accounts',
}

export function useAccounts() {
  const { get } = useApi();

  return useQuery(AccountsQueriesKey.Accounts, () =>
    get<Account[]>('/accounts'),
  );
}
