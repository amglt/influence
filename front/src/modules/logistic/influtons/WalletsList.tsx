import { Listing } from '@Components/Listing';
import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { ColumnsType } from 'antd/lib/table';
import { Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Wallet } from '@Models/wallet.models';
import { useWallets } from '@Api/logistic/wallets/wallets.queries';

export function WalletsList() {
  const { data: walletsData } = useWallets();

  const columns: ColumnsType<Wallet> = [
    {
      key: 'name',
      dataIndex: 'name',
      title: `Nom d'utilisateur`,
      filtered: true,
      sorter: (a, b) => a.userId.localeCompare(b.userId),
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
        <Listing<Wallet> columns={columns} data={[] ?? walletsData} />
      </Content>
    </>
  );
}
