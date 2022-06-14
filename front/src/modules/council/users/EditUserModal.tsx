import { FormInstance, Modal, Form, Input, Select } from 'antd';
import { Role, User } from '@Models/root.models';
import { useUser } from '@Api/council/users/users.queries';
import { Spinner } from '@Components/Spinner';

export interface EditUserModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onOk: () => void;
  form: FormInstance;
  selectedUser?: User;
  roles: Role[];
  isLoadingRoles: boolean;
}

export function EditUserModal(props: EditUserModalProps) {
  const {
    isVisible,
    form,
    selectedUser,
    roles,
    isLoadingRoles,
    onCancel,
    onOk,
  } = props;

  const { isLoading: isLoadingUser } = useUser(selectedUser?.user_id, form);

  return (
    <Modal
      title={'Editer un utilisateur'}
      visible={isVisible}
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
          <Form.Item label="Nom" name="name">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Select
              options={
                roles.map((role) => ({
                  label: role.name,
                  value: role.id,
                })) ?? []
              }
              loading={isLoadingRoles}
              allowClear
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
