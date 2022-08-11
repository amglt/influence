import { Form, FormInstance, Input, Modal } from 'antd';
import { Period } from '@Models/pvp-management.models';

export interface EditPeriodModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onOk: () => void;
  form: FormInstance;
  selectedPeriod?: Period;
}

export function EditPeriodModal(props: EditPeriodModalProps) {
  const { selectedPeriod, onOk, form, onCancel, isVisible } = props;

  return (
    <Modal
      title={'Editer une période'}
      visible={isVisible}
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
        initialValues={{
          reward: selectedPeriod?.reward,
        }}
      >
        <Form.Item label="Récompense totale" name="reward">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
