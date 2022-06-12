import { createElement, ReactNode, useEffect, useState } from 'react';
import { Dropdown, Layout as AntLayout, Menu, Space } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  StarOutlined,
  CrownOutlined,
  UserOutlined,
  DownOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import './layout.less';
import logo from '../../../public/assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { Text } from '@Components/Typography';
import { useAuth0 } from '@auth0/auth0-react';
import { useSelector } from '@Store/';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { AppPermissions } from '@Models/root.models';

const { Header, Sider } = AntLayout;

interface LayoutProps {
  children?: ReactNode;
}

export function Layout(props: LayoutProps) {
  const { children } = props;

  const navigate = useNavigate();
  const { loginWithRedirect, logout } = useAuth0();
  const { user } = useSelector((state) => state.root);

  const [collapsed, setCollapsed] = useState(true);
  const [menuItems, setMenuItems] = useState<ItemType[]>([]);

  useEffect(() => {
    const updatedMenuItems = [];
    if (user.user_id) {
      if (user.permissions.includes(AppPermissions.IsRecruitment)) {
        updatedMenuItems.push({
          key: 'recruitment',
          icon: <UsergroupAddOutlined />,
          label: 'Recrutement',
          children: [
            {
              key: 'accounts',
              label: 'Accounts',
              icon: <UserOutlined />,
              onClick: () => navigate('/recruitment/accounts'),
            },
            {
              key: 'characters',
              label: 'Characters',
              icon: <UserOutlined />,
              onClick: () => navigate('/recruitment/characters'),
            },
          ],
        });
      }
      if (user.permissions.includes(AppPermissions.IsCouncil)) {
        updatedMenuItems.push({
          key: 'council',
          icon: <StarOutlined />,
          label: 'Conseil',
          children: [
            {
              key: 'roles',
              label: 'Roles',
              icon: <CrownOutlined />,
              onClick: () => navigate('/council/roles'),
            },
          ],
        });
      }
    }
    setMenuItems(updatedMenuItems);
  }, [navigate, user.permissions, user.user_id]);

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

  const renderUser = () => {
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
  };

  return (
    <AntLayout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" onClick={() => navigate('/')}>
          <img src={logo} alt={'Influence-logo'} height={35} width={35} />{' '}
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} />
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
        <div style={{ padding: '0 24px 24px' }}>{children}</div>
      </AntLayout>
    </AntLayout>
  );
}
