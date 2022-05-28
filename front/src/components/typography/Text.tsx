import { Typography } from 'antd';
import { TextProps } from 'antd/lib/typography/Text';
import { RefAttributes } from 'react';

const { Text: AntText } = Typography;

export function Text(props: TextProps & RefAttributes<HTMLSpanElement>) {
  return <AntText {...props} />;
}
