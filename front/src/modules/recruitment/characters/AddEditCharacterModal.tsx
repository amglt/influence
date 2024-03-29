import { Form, Input, Select, FormInstance, Modal } from 'antd';
import React from 'react';
import { Classes, Ranks } from '../../../shared/root.enums';
import { Account } from '../../../models/account.models';
import { Character } from '../../../models/character.model';
import { Spinner } from '../../../components/Spinner';
import DatePicker from '../../../components/DatePicker';

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
          <Form.Item label="Classe" name="class">
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
              optionFilterProp="label"
              placeholder="Sélectionnez le compte du personnage."
              options={accounts.map((account) => ({
                label: account.name,
                value: account.id,
              }))}
            />
          </Form.Item>
          <Form.Item label="Date de recrutement" name="recruitmentDate">
            <DatePicker placeholder="" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
