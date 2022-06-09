import { useAccounts } from '@Api/council/accounts/accounts.queries';
import { User } from '@Models/root.models';
import { Form, Input, Select, FormInstance, Modal } from 'antd';
import React from 'react';

export interface AddAccountModalProps {
  isOpen: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  form: FormInstance;
  users: User[];
}

export function AddAccountModal(props: AddAccountModalProps) {
  const { isOpen, form, users, onOk, onCancel } = props;
  const { Option } = Select;
  const { data: accounts } = useAccounts();

  return (
    <Modal
      title={'Ajouter un compte Dofus'}
      visible={isOpen}
      okText={'Valider'}
      cancelText={'Annuler'}
      onOk={onOk}
      onCancel={onCancel}
      width={'70vw'}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        labelAlign={'left'}
        form={form}
      >
        <Form.Item
          label="Compte Dofus"
          name="accountName"
          rules={[
            { required: true, message: 'Le compte Dofus est obligatoire' },
            {
              pattern: /[0-9a-z]{2,20}#[1-9][0-9]{3}/,
              message: 'Veuillez entrer un nom de compte correct.',
            },
            {
              validator(_, value) {
                if (!accounts?.some((account) => account.name === value)) {
                  return Promise.resolve();
                }
                return Promise.reject('Ce nom de compte Dofus existe déjà.');
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Utilisateur"
          name="userId"
          rules={[{ required: true, message: "L'utilisateur est obligatoire" }]}
        >
          <Select
            placeholder="Selectionnez l'utilisateur auquel le compte Dofus doit être associé"
            allowClear
          >
            {users.map((user) => (
              <Option value={user.user_id}>{user.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
