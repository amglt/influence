import { useQuery } from 'react-query';
import { Transaction, Wallet } from '../../models/influtons.models';
import { useApi } from '../../hooks/api';

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
