import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { AddEditAccountModal } from './AddEditAccountModal';
import { Account } from '../../../models/account.models';
import {
  useAccount,
  useAccounts,
} from '../../../api/recruitment/accounts/accounts.queries';
import { useUsers } from '../../../api/council/users/users.queries';
import {
  useAddAccount,
  useDeleteAccount,
  useEditAccount,
} from '../../../api/recruitment/accounts/accounts.mutations';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { Content } from '../../../components/Content';
import { Listing } from '../../../components/Listing';
import { ModalConfirmDelete } from '../../../components/ModalConfirmDelete';

export function AccountsList() {
  const [isAddEditAccountModalOpen, setIsAddEditAccountModalOpen] =
    useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();
  const [addEditAccountForm] = useForm();

  const { data: accountsData, isLoading: isLoadingAccounts } = useAccounts();
  const { data: accountData, isLoading: isAccountLoading } = useAccount(
    selectedAccount?.id,
    addEditAccountForm,
  );
  const { data: usersData } = useUsers();

  const { mutate: deleteAccount } = useDeleteAccount();
  const { mutate: createAccount } = useAddAccount();
  const { mutate: editAccount } = useEditAccount();

  const closeAddEditAccountModal = () => {
    setSelectedAccount(undefined);
    addEditAccountForm.resetFields();
    setIsAddEditAccountModalOpen(false);
  };

  const handleOnOkCreateAccount = async () => {
    try {
      await addEditAccountForm.validateFields();
      const name = addEditAccountForm.getFieldValue('name');
      const userId = addEditAccountForm.getFieldValue('userId');
      if (selectedAccount) {
        editAccount({
          accountId: selectedAccount.id,
          body: { name, userId },
        });
      } else {
        createAccount({ name, userId });
      }
      closeAddEditAccountModal();
    } catch {}
  };

  return (
    <>
      <AddEditAccountModal
        isOpen={isAddEditAccountModalOpen}
        onCancel={closeAddEditAccountModal}
        onOk={handleOnOkCreateAccount}
        form={addEditAccountForm}
        users={usersData ?? []}
        selectedAccount={accountData}
        isLoadingAccount={isAccountLoading}
      />
      <Breadcrumb
        items={[
          { key: 'recruitment', label: 'Recrutement' },
          { key: 'accounts', label: 'Comptes de jeu' },
        ]}
      />
      <Content>
        <Button
          type={'primary'}
          onClick={() => setIsAddEditAccountModalOpen(true)}
        >
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
              render: (_, record) => {
                return (
                  <Space>
                    <EditOutlined
                      onClick={() => {
                        setSelectedAccount(record);
                        setIsAddEditAccountModalOpen(true);
                      }}
                    />
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
                  </Space>
                );
              },
            },
          ]}
          data={accountsData}
          loading={isLoadingAccounts}
        />
      </Content>
    </>
  );
}
