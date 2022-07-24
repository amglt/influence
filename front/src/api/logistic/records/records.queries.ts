import { WalletRecord, WalletRecordWithUsers } from '@Models/wallet.models';
import { useApi } from '@Hooks/api';
import { FormInstance } from 'antd';
import { useQuery } from 'react-query';

export enum WalletsQueriesKey {
  WalletRecords = 'WalletRecords',
  WalletRecord = 'WalletRecord',
}

export function useWalletRecords() {
  const { get } = useApi();

  return useQuery(WalletsQueriesKey.WalletRecords, () =>
    get<WalletRecordWithUsers[]>('/influtons/records'),
  );
}

// TODO
export function useWalletRecord(id?: number, form?: FormInstance) {
  const { get } = useApi();

  return useQuery(
    [WalletsQueriesKey.WalletRecord, id],
    () => get<WalletRecord>(`/influtons/records/${id}`),
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
