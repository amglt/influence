import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface SpinnerProps {
  color?: string;
}
export function Spinner(props: SpinnerProps) {
  const { color } = props;

  const antIcon = <LoadingOutlined style={{ fontSize: 24, color }} spin />;

  return <Spin indicator={antIcon} />;
}
