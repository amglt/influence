import { Checkbox, Col, Form, FormInstance, Input, Modal, Row } from 'antd';
import { Permission, RoleWithPermissions } from '@Models/root.models';
import { Spinner } from '@Components/Spinner';

export interface AddEditRoleModalProps {
  isOpen: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  form: FormInstance;
  permissions: Permission[];
  selectedRole?: RoleWithPermissions;
  isLoadingRole?: boolean;
}

export function AddEditRoleModal(props: AddEditRoleModalProps) {
  const {
    isOpen,
    form,
    permissions,
    isLoadingRole,
    selectedRole,
    onOk,
    onCancel,
  } = props;

  return (
    <Modal
      title={selectedRole ? 'Editer un role' : 'Ajouter un role'}
      visible={isOpen}
      okText={'Valider'}
      cancelText={'Annuler'}
      onOk={onOk}
      onCancel={onCancel}
      width={'70vw'}
    >
      {isLoadingRole ? (
        <Spinner />
      ) : (
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          labelAlign={'left'}
          form={form}
        >
          <Form.Item
            label="Nom"
            name="name"
            rules={[
              { required: true, message: 'Le nom de role est obligatoire' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="permissions" label="Permissions">
            <Checkbox.Group>
              <Row>
                {permissions.map((perm) => (
                  <Col span={8} key={perm.id}>
                    <Checkbox value={perm.id} style={{ lineHeight: '32px' }}>
                      {perm.name}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
