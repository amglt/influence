import { Form, InputNumber, Select, FormInstance, Modal } from 'antd';
import { User } from '@Models/root.models';
import React from 'react';
import { Spinner } from '@Components/Spinner';

export interface NewTransactionModalProps {
  isOpen: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  form: FormInstance;
  users: User[];
  isLoadingUser?: boolean;
}

// TODO - Pour la suite, créer une transaction depuis le site
export function NewTransactionModal(props: NewTransactionModalProps) {
  const { isOpen, form, users, onOk, onCancel, isLoadingUser } = props;

  const { Option } = Select;

  return (
    <Modal
      title={'Créer une nouvelle transaction'}
      visible={isOpen}
      okText={'Valider'}
      cancelText={'Annuler'}
      onOk={onOk}
      onCancel={onCancel}
      width={'70vw'}
    >
      {isLoadingUser ? (
        <Spinner />
      ) : (
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          labelAlign={'left'}
          form={form}
        >
          <Form.Item
            label="Emetteur"
            name="userIdFrom"
            rules={[{ required: true, message: "L'emetteur est obligatoire." }]}
          >
            <Select placeholder="Sélectionnez l'emetteur">
              {users.map((user) => (
                <Option value={user.user_id}>{user.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Destinataire"
            name="userIdFrom"
            rules={[
              { required: true, message: 'Le destinataire est obligatoire.' },
            ]}
          >
            <Select placeholder="Sélectionnez le destinataire">
              {users.map((user) => (
                <Option value={user.user_id}>{user.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Montant"
            name="amount"
            rules={[
              { required: true, message: 'Le montant est obligatoire.' },
              {},
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
