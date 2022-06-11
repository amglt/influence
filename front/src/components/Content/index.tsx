import { Layout } from 'antd';
import { ReactNode } from 'react';

const { Content: AntContent } = Layout;

export function Content(props: { children?: ReactNode }) {
  return (
    <AntContent
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
        backgroundColor: 'white',
      }}
    >
      {props.children}
    </AntContent>
  );
}
