import { FormInstance, Modal, Form, Select, Checkbox } from 'antd';
import { PvpGameStatus } from '../models/pvp-management.models';

export interface UpdateGameModalProps {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  form: FormInstance;
}

export function UpdateGameModal(props: UpdateGameModalProps) {
  const { isOpen, form, onOk, onCancel } = props;

  return (
    <Modal
      title={`Mise à jour d'une partie`}
      onOk={onOk}
      onCancel={onCancel}
      visible={isOpen}
      afterClose={onCancel}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          status: 0,
          isBigOpponent: false,
        }}
      >
        <Form.Item
          name={'status'}
          label={'Nouveau status'}
          rules={[{ required: true }]}
        >
          <Select
            options={(
              Object.keys(PvpGameStatus).filter((v) =>
                isNaN(Number(v)),
              ) as (keyof typeof PvpGameStatus)[]
            ).map((key) => ({
              value: PvpGameStatus[key],
              label: key,
            }))}
          />
        </Form.Item>
        <Form.Item
          name={'isBigOpponent'}
          label={'Big Alliance'}
          rules={[{ required: true }]}
          valuePropName={'checked'}
        >
          <Checkbox />
        </Form.Item>
      </Form>
    </Modal>
  );
}
