import { useQuery } from 'react-query';
import { FormInstance } from 'antd';
import { useApi } from '../../../hooks/api';
import { Account } from '../../../models/account.models';

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
