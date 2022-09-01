import { Form, Input, Select, FormInstance, Modal } from 'antd';
import React from 'react';
import { User } from '../../../models/root.models';
import { Account } from '../../../models/account.models';
import { Spinner } from '../../../components/Spinner';

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
                pattern: /^[0-9a-zA-Z-]{2,30}#[1-9][0-9]{3}$/,
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
              optionFilterProp="label"
              placeholder="Selectionnez l'utilisateur auquel le compte Dofus doit être associé"
              options={users.map((user) => ({
                label: user.nickname,
                value: user.id,
              }))}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
