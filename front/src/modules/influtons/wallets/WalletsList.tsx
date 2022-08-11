import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { Form, InputNumber, Modal, Space } from 'antd';
import { Listing } from '@Components/Listing';
import { Wallet } from '@Models/influtons.models';
import { useWallets } from '@Api/influtons/influtons.queries';
import { MailOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useCreateWalletTransaction } from '@Api/influtons/influtons.mutations';
import { useForm } from 'antd/es/form/Form';

export function WalletsList() {
  const [isSendMoneyModalOpen, setIsSendMoneyModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | undefined>(
    undefined,
  );
  const [createTransactionForm] = useForm();
  const { data: wallets, isLoading: isLoadingWallets } = useWallets();
  const { mutate: createTransaction } = useCreateWalletTransaction();

  const onCloseCreateTransactionModal = () => {
    setSelectedWallet(undefined);
    setIsSendMoneyModalOpen(false);
  };

  const onCreateTransactionOk = () => {
    if (selectedWallet) {
      createTransaction({
        walletFromId: undefined,
        walletToId: selectedWallet.id,
        amount: createTransactionForm.getFieldValue('amount'),
      });
      onCloseCreateTransactionModal();
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'influtons', label: 'Influtons' },
          { key: 'wallets', label: 'Porte-monnaies' },
        ]}
      />
      <Content>
        <Modal
          title={'Donner des influtons'}
          visible={isSendMoneyModalOpen}
          okText={'Valider'}
          cancelText={'Annuler'}
          onOk={onCreateTransactionOk}
          onCancel={onCloseCreateTransactionModal}
          width={'70vw'}
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            labelAlign={'left'}
            form={createTransactionForm}
            initialValues={{
              amount: 0,
            }}
          >
            <Form.Item
              label="Montant"
              name="amount"
              rules={[
                { required: true, message: 'Le montant est obligatoire.' },
              ]}
            >
              <InputNumber min={0} step={1} />
            </Form.Item>
          </Form>
        </Modal>
        <Listing<Wallet>
          columns={[
            {
              key: 'id',
              dataIndex: 'id',
              title: 'ID',
              filtered: true,
              sorter: (a, b) => a.id - b.id,
            },
            {
              key: 'user',
              dataIndex: ['user', 'nickname'],
              title: 'Utilisateur',
              filtered: true,
              sorter: (a, b) => a.user.nickname.localeCompare(b.user.nickname),
            },
            {
              key: 'balance',
              dataIndex: 'balance',
              title: 'Montant',
              sorter: (a, b) => a.balance - b.balance,
            },
            {
              key: 'actions',
              dataIndex: 'actions',
              render: (_, record) => {
                return (
                  <Space>
                    <MailOutlined
                      onClick={() => {
                        setIsSendMoneyModalOpen(true);
                        setSelectedWallet(record);
                      }}
                    />
                  </Space>
                );
              },
            },
          ]}
          data={wallets}
          loading={isLoadingWallets}
        />
      </Content>
    </>
  );
}
