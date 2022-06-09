import { Listing } from '@Components/listing';
import { Breadcrumb } from '@Components/breadcrumb';
import { Content } from '@Components/content';
import { Account } from '@Models/account.model';
import { DeleteOutlined } from '@ant-design/icons';
import { useAccounts } from '@Api/council/accounts/accounts.queries';
import {
  useAddAccount,
  useDeleteAccount,
} from '@Api/council/accounts/accounts.mutations';
import { ModalConfirmDelete } from '@Components/modalconfirmdelete';
import { Button, FormInstance } from 'antd';
import { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { AddAccountModal } from './AddAccountModal';
import { useUsers } from '@Api/council/users/users.queries';

export function AccountsList() {
  const { data, isLoading } = useAccounts();
  const { mutate: deleteAccount } = useDeleteAccount();

  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [addAccountForm] = useForm();

  const { data: usersData } = useUsers();

  const { mutate: createAccount } = useAddAccount();

  const closeAddAccountModal = () => {
    addAccountForm.resetFields();
    setIsAddAccountModalOpen(false);
  };

  const handleOnOkCreateAccount = async () => {
    try {
      await addAccountForm.validateFields();
      const accountName = addAccountForm.getFieldValue('accountName');
      const userId = addAccountForm.getFieldValue('userId');
      createAccount({ accountName, userId });
      closeAddAccountModal();
    } catch {}
  };

  return (
    <>
      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onCancel={closeAddAccountModal}
        onOk={handleOnOkCreateAccount}
        form={addAccountForm}
        users={usersData ?? []}
      />
      <Breadcrumb
        items={[
          { key: 'council', label: 'Conseil' },
          { key: 'accounts', label: 'Accounts' },
        ]}
      />
      <Content>
        <Button type={'primary'} onClick={() => setIsAddAccountModalOpen(true)}>
          Ajouter un compte
        </Button>
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
