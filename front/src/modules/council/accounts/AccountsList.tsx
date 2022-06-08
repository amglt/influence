import { Listing } from '@Components/listing';
import { Breadcrumb } from '@Components/breadcrumb';
import { Content } from '@Components/content';
import { Account } from '@Models/account.model';
import { DeleteOutlined } from '@ant-design/icons';
import { useAccounts } from '@Api/council/accounts/accounts.queries';
import { useDeleteAccount } from '@Api/council/accounts/accounts.mutations';
import { ModalConfirmDelete } from '@Components/modalconfirmdelete';

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
                  <DeleteOutlined
                    onClick={() => {
                      ModalConfirmDelete({
                        title: (
                          <span>
                            Etes-vous sûr de vouloir supprimer le compte
                            <strong> {record.name}</strong> ?
                          </span>
                        ),
                        content: 'Cette action est irréversible.',
                        onOk: () => deleteAccount(record.id),
                      });
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
