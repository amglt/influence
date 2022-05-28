import { createElement, ReactNode, useState } from 'react';
import { Dropdown, Layout as AntLayout, Menu, Space } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  StarOutlined,
  CrownOutlined,
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons';
import './layout.less';
import { useNavigate } from 'react-router-dom';
import { Text } from '@Components/typography';
import { useAuth0 } from '@auth0/auth0-react';
import { useSelector } from '@Store/';
import { Spinner } from '@Components/Spinner';

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
  children?: ReactNode;
  isLoadingUser: boolean;
}

export function Layout(props: LayoutProps) {
  const { children, isLoadingUser } = props;

  const navigate = useNavigate();
  const { loginWithRedirect, logout } = useAuth0();
  const { user } = useSelector((state) => state.root);

  const [collapsed, setCollapsed] = useState(false);

  const userMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: 'Déconnexion',
          onClick: () => logout(),
        },
      ]}
    />
  );

  function renderUser() {
    if (user.user_id) {
      return (
        <Dropdown
          overlay={userMenu}
          arrow
          trigger={['click']}
          className={'user-menu'}
        >
          <Space style={{ color: 'white' }}>
            {user.name}
            <DownOutlined />
          </Space>
        </Dropdown>
      );
    } else if (isLoadingUser) {
      return (
        <span className={'user-menu'}>
          <Spinner color={'white'} />
        </span>
      );
    } else {
      return (
        <span
          className={'login'}
          onClick={async () => {
            await loginWithRedirect();
          }}
        >
          <UserOutlined className={'user-icon'} style={{ color: 'white' }} />
          <Text style={{ color: 'white' }}>Se connecter</Text>
        </span>
      );
    }
  }

  return (
    <AntLayout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo"></div>
        <Menu
          theme="dark"
          mode="inline"
          items={[
            {
              key: 'council',
              icon: <StarOutlined />,
              label: 'Conseil',
              children: [
                {
                  key: 'roles',
                  label: 'Roles',
                  icon: <CrownOutlined />,
                  onClick: () => navigate('/conseil/roles'),
                },
              ],
            },
          ]}
        />
      </Sider>
      <AntLayout className="site-layout">
        <Header style={{ padding: 0 }} className={'site-layout-header'}>
          {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            style: { color: 'white' },
            onClick: () => setCollapsed(!collapsed),
          })}
          {renderUser()}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
