import { Account } from '@Models/account.models';
import { User } from '@Models/root.models';
import { Form, Input, Select, FormInstance, Modal } from 'antd';
import React from 'react';
import { Spinner } from '@Components/Spinner';

export interface AddEditAccountModalProps {
  isOpen: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  form: FormInstance;
  users: User[];
  selectedAccount?: Account;
  isLoadingAccount?: boolean;
}

export function AddEditAccountModal(props: AddEditAccountModalProps) {
  const {
    isOpen,
    form,
    users,
    onOk,
    onCancel,
    selectedAccount,
    isLoadingAccount,
  } = props;
  const { Option } = Select;

  return (
    <Modal
      title={
        selectedAccount ? 'Éditer un compte Dofus' : 'Ajouter un compte Dofus'
      }
      visible={isOpen}
      okText={'Valider'}
      cancelText={'Annuler'}
      onOk={onOk}
      onCancel={onCancel}
      width={'70vw'}
    >
      {isLoadingAccount ? (
        <Spinner />
      ) : (
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          labelAlign={'left'}
          form={form}
        >
          <Form.Item
            label="Compte Dofus"
            name="name"
            rules={[
              { required: true, message: 'Le compte Dofus est obligatoire' },
              {
                pattern: /^[0-9a-zA-Z-]{2,20}#[1-9][0-9]{3}$/,
                message: 'Veuillez entrer un nom de compte correct.',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Utilisateur"
            name="userId"
            rules={[
              { required: true, message: "L'utilisateur est obligatoire" },
            ]}
          >
            <Select
              showSearch
              placeholder="Selectionnez l'utilisateur auquel le compte Dofus doit être associé"
            >
              {users.map((user) => (
                <Option value={user.id}>{user.nickname}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
