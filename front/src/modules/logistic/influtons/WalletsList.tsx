import { Listing } from '@Components/Listing';
import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { ColumnsType } from 'antd/lib/table';
import { useWallets } from '@Api/logistic/wallets/wallets.queries';
import { WalletWithUser } from '@Models/wallet.models';

export function WalletsList() {
  const { data: walletsData } = useWallets();

  const columns: ColumnsType<WalletWithUser> = [
    {
      key: 'name',
      dataIndex: ['user', 'name'],
      title: `Nom d'utilisateur`,
      filtered: true,
      sorter: (a, b) => a.user.name.localeCompare(b.user.name),
    },
    {
      key: 'balance',
      dataIndex: 'balance',
      title: 'Balance',
      filtered: true,
      sorter: (a, b) => a.influcoinBalance - b.influcoinBalance,
    },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'logistic', label: 'Logistique' },
          { key: 'wallets', label: 'Wallets' },
        ]}
      />
      <Content>
        <Listing<WalletWithUser> columns={columns} data={walletsData} />
      </Content>
    </>
  );
}
