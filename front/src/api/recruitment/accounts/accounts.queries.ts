import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { Account } from '@Models/account.models';
import { FormInstance } from 'antd';

export enum AccountsQueriesKey {
  Accounts = 'Accounts',
  Account = 'Account',
}

export function useAccounts() {
  const { get } = useApi();

  return useQuery(AccountsQueriesKey.Accounts, () =>
    get<Account[]>('/accounts'),
  );
}

export function useAccount(id?: number, form?: FormInstance) {
  const { get } = useApi();

  return useQuery(
    [AccountsQueriesKey.Account, id],
    () => get<Account>(`/accounts/${id}`),
    {
      enabled: !!id,
      onSuccess: (data) => {
        form?.setFieldsValue({
          name: data.name,
          userId: data.userId,
        });
      },
    },
  );
}
