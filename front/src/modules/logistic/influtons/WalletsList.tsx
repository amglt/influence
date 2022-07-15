import { Listing } from '@Components/Listing';
import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { ColumnsType } from 'antd/lib/table';
import { Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Wallet } from '@Models/wallet.models';
import { useWallets } from '@Api/logistic/wallets/wallets.queries';
import { WalletWithUser } from '@Models/walletWithUser.models';

export function WalletsList() {
  const { data: walletsData } = useWallets();
  console.log(walletsData);

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
    {
      key: 'actions',
      render: (_, record) => (
        <Space>
          <EditOutlined onClick={() => {}} />
          <DeleteOutlined onClick={() => {}} />
        </Space>
      ),
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
        {/* TODO */}
        <Listing<WalletWithUser> columns={columns} data={walletsData} />
      </Content>
    </>
  );
}
