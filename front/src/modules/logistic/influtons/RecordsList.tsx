import { Listing } from '@Components/Listing';
import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { ColumnsType } from 'antd/lib/table';
import { Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { WalletRecord } from '@Models/walletRecord.models';

export function RecordsList() {
  // const { data: walletRecordsData } = useWalletRecord();

  const columns: ColumnsType<WalletRecord> = [
    {
      key: 'amount',
      dataIndex: 'amount',
      title: 'Montant',
      filtered: true,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      key: 'walletIdFrom',
      dataIndex: 'walletIdFrom',
      title: `Wallet Id From`,
      filtered: true,
      sorter: (a, b) => a.walletIdFrom - b.walletIdFrom,
    },
    {
      key: 'walletIdTo',
      dataIndex: 'walletIdTo',
      title: `Wallet Id To`,
      filtered: true,
      sorter: (a, b) => a.walletIdTo - b.walletIdTo,
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
          { key: 'records', label: 'Records' },
        ]}
      />
      <Content>
        {/* TODO */}
        <Listing<WalletRecord> columns={columns} data={[]} />
      </Content>
    </>
  );
}
