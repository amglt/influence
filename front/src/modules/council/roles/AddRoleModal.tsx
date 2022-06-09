import { Checkbox, Col, Form, FormInstance, Input, Modal, Row } from 'antd';
import { Permission } from '@Models/root.models';

export interface AddRoleModalProps {
  isOpen: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  form: FormInstance;
  permissions: Permission[];
}

export function AddRoleModal(props: AddRoleModalProps) {
  const { isOpen, form, permissions, onOk, onCancel } = props;

  return (
    <Modal
      title={'Ajouter un role'}
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
          label="Nom"
          name="name"
          rules={[
            { required: true, message: 'Le nom de role est obligatoire' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: 'La description de role est obligatoire',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="permissions" label="Permissions">
          <Checkbox.Group>
            <Row>
              {permissions.map((perm) => (
                <Col span={8} key={perm.permission_name}>
                  <Checkbox
                    value={perm.permission_name}
                    style={{ lineHeight: '32px' }}
                  >
                    {perm.permission_name}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
