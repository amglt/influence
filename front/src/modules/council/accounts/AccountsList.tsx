import { Listing } from '@Components/listing';
import { Breadcrumb } from '@Components/breadcrumb';
import { Content } from '@Components/content';
import { Account } from '@Models/root.models';
import { DeleteOutlined } from '@ant-design/icons';
import { useAccounts } from '@Api/council/accounts/accounts.queries';
import { useDeleteAccount } from '@Api/council/accounts/accounts.mutations';

export function AccountsList() {
  const { data, isLoading } = useAccounts();
  const { mutate: deleteAccount } = useDeleteAccount();

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
                  <DeleteOutlined onClick={() => deleteAccount(record.id)} />
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
