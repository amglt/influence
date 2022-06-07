import { Listing } from '@Components/listing';
import { Breadcrumb } from '@Components/breadcrumb';
import { Content } from '@Components/content';
import { Account } from '@Models/account.model';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useAccounts } from '@Api/council/accounts/accounts.queries';
import { useDeleteAccount } from '@Api/council/accounts/accounts.mutations';

export function AccountsList() {
  const { data, isLoading } = useAccounts();
  const { mutate: deleteAccount } = useDeleteAccount();

  const { confirm } = Modal;

  const showDeleteConfirm = (record: Account) => {
    confirm({
      title: (
        <span>
          Etes-vous sûr de vouloir supprimer le compte
          <strong> {record.name}</strong> ?
        </span>
      ),
      icon: <ExclamationCircleOutlined />,
      content: 'Cette action est irréversible.',
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk() {
        deleteAccount(record.id);
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'council', label: 'Conseil' },
          { key: 'accounts', label: 'Accounts' },
        ]}
      />
      <Content>
        <Listing<Account>
          columns={[
            {
              key: 'name',
              dataIndex: 'name',
              title: 'Nom',
              filtered: true,
              sorter: (a, b) => a.name.localeCompare(b.name),
            },
            {
              key: 'actions',
              dataIndex: 'actions',
              render: (_, record) => {
                return (
                  <DeleteOutlined
                    onClick={() => {
                      console.log('Delete account clicked');
                      showDeleteConfirm(record);
                    }}
                  />
                );
              },
            },
          ]}
          data={data}
          loading={isLoading}
        />
      </Content>
    </>
  );
}
