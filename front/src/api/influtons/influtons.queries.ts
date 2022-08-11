import { useApi } from '@Hooks/api';
import { useQuery } from 'react-query';
import { Transaction, Wallet } from '@Models/influtons.models';

export enum InflutonQueriesKeys {
  Wallets = 'Wallets',
  Transactions = 'Transactions',
}

export function useWallets() {
  const { get } = useApi();

  return useQuery([InflutonQueriesKeys.Wallets], () =>
    get<Wallet[]>(`/wallets`),
  );
}

export function useTransactions() {
  const { get } = useApi();

  return useQuery([InflutonQueriesKeys.Transactions], () =>
    get<Transaction[]>(`/wallets/transactions`),
  );
}
