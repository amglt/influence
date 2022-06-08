import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { ReactNode } from 'react';

interface ModalConfirmDeleteProps {
  title: ReactNode;
  content?: ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
}

export function ModalConfirmDelete(props: ModalConfirmDeleteProps) {
  const { confirm } = Modal;

  const { title, content, onOk, onCancel } = props;

  return confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText: 'Oui',
    okType: 'danger',
    cancelText: 'Non',
    onOk,
    onCancel,
  });
}
