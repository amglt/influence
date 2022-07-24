import { Listing } from '@Components/Listing';
import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { ColumnsType } from 'antd/lib/table';
import { useWalletRecords } from '@Api/logistic/records/records.queries';
import { WalletRecordWithUsers } from '@Models/wallet.models';

export function RecordsList() {
  const { data: walletRecordsData } = useWalletRecords();

  const columns: ColumnsType<WalletRecordWithUsers> = [
    {
      key: 'amount',
      dataIndex: 'amount',
      title: 'Montant',
      filtered: true,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      key: 'userFrom',
      dataIndex: ['userFrom', 'name'],
      title: `Emetteur`,
      filtered: true,
      sorter: (a, b) => a.userFrom!.name.localeCompare(b.userFrom!.name),
    },
    {
      key: 'userTo',
      dataIndex: ['userTo', 'name'],
      title: `Destinataire`,
      filtered: true,
      sorter: (a, b) => a.userTo!.name.localeCompare(b.userTo!.name),
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
        <Listing<WalletRecordWithUsers>
          columns={columns}
          data={walletRecordsData}
        />
      </Content>
    </>
  );
}
