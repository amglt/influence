import { Breadcrumb as AntBreadcrumb } from 'antd';
import { Key } from 'react';

interface BreadcrumbProps {
  items: { key: Key; label: string }[];
}

export function Breadcrumb(props: BreadcrumbProps) {
  return (
    <AntBreadcrumb style={{ margin: '16px 0' }}>
      {props.items.map((item) => (
        <AntBreadcrumb.Item key={item.key}>{item.label}</AntBreadcrumb.Item>
      ))}
    </AntBreadcrumb>
  );
}
