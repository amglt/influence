import { Character } from '@Models/character.model';
import { Form, Input, Select, FormInstance, Modal, DatePicker } from 'antd';
import React from 'react';
import { Spinner } from '@Components/Spinner';
import { Account } from '@Models/account.models';
import { Classes, Ranks } from '../../../shared/root.enums';

export interface AddEditCharacterModalProps {
  isOpen: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  form: FormInstance;
  accounts: Account[];
  selectedCharacter?: Character;
  isLoadingCharacter?: boolean;
}

export function AddEditCharacterModal(props: AddEditCharacterModalProps) {
  const {
    isOpen,
    form,
    accounts,
    onOk,
    onCancel,
    selectedCharacter,
    isLoadingCharacter,
  } = props;
  const { Option } = Select;

  return (
    <Modal
      title={
        selectedCharacter ? 'Modifier un personnage' : 'Ajouter un personnage'
      }
      visible={isOpen}
      okText={'Valider'}
      cancelText={'Annuler'}
      onOk={onOk}
      onCancel={onCancel}
      width={'70vw'}
    >
      {isLoadingCharacter ? (
        <Spinner />
      ) : (
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          labelAlign={'left'}
          form={form}
        >
          <Form.Item
            label="Pseudo"
            name="name"
            rules={[{ required: true, message: 'Le pseudo est obligatoire.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Classe"
            name="class"
            rules={[{ required: true, message: 'La classe est obligatoire.' }]}
          >
            <Select
              showSearch
              placeholder="Sélectionnez la classe du personnage."
              options={Object.values(Classes).map((c) => ({
                label: c,
                value: c,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Rang"
            name="rank"
            rules={[{ required: true, message: 'Le rang est obligatoire.' }]}
          >
            <Select
              showSearch
              placeholder="Sélectionnez le rang du personnage."
              options={Object.values(Ranks).map((r) => ({
                label: r,
                value: r,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Compte"
            name="accountId"
            rules={[{ required: true, message: 'Le compte est obligatoire.' }]}
          >
            <Select
              showSearch
              placeholder="Sélectionnez le compte du personnage."
            >
              {accounts.map((account) => (
                <Option key={account.id} value={account.id}>
                  {account.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Date de recrutement"
            name="recruitmentDate"
            rules={[
              {
                required: true,
                message: 'La date de recrutement est obligatoire.',
              },
            ]}
          >
            <DatePicker placeholder="" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
