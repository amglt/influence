import { useApi } from '@Hooks/api';
import { WalletWithUser } from '@Models/walletWithUser.models';
import { FormInstance } from 'antd';
import { useQuery } from 'react-query';

export enum WalletsQueriesKey {
  Wallets = 'Wallets',
  Wallet = 'Wallet',
}

export function useWallets() {
  const { get } = useApi();

  return useQuery(WalletsQueriesKey.Wallets, () =>
    get<WalletWithUser[]>('/wallets'),
  );
}

// TODO
export function useWallet(id?: number, form?: FormInstance) {
  const { get } = useApi();

  return useQuery(
    [WalletsQueriesKey.Wallet, id],
    () => get<WalletWithUser>(`/wallets/${id}`),
    {
      enabled: !!id,
      onSuccess: (wallet) => {
        form?.setFieldsValue({
          // TODO
        });
      },
    },
  );
}
