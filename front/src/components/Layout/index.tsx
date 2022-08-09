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
  ScissorOutlined,
  CalendarOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import './layout.less';
import logo from '../../../public/assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { Text } from '@Components/Typography';
import { useDispatch, useSelector } from '@Store/';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { AppPermissions } from '@Models/root.models';
import { resetRoot } from '@Store/root.slice';
import axios from 'axios';

const { Header, Sider } = AntLayout;

interface LayoutProps {
  children?: ReactNode;
}

export function Layout(props: LayoutProps) {
  const { children } = props;

  const navigate = useNavigate();
  const { user, discordToken } = useSelector((state) => state.root);
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(true);
  const [menuItems, setMenuItems] = useState<ItemType[]>([]);

  useEffect(() => {
    const updatedMenuItems = [];
    if (user.id) {
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
      if (
        user.permissions.includes(AppPermissions.IsPVP) ||
        user.permissions.includes(AppPermissions.IsLogistic)
      ) {
        updatedMenuItems.push({
          key: 'pvp-management-management',
          icon: <ScissorOutlined />,
          label: 'PVP management',
          children: [
            {
              key: 'periods',
              label: 'Périodes',
              icon: <CalendarOutlined />,
              onClick: () => navigate('/pvp-management-management/periods'),
            },
            {
              key: 'scale',
              label: 'Barème',
              icon: <NumberOutlined />,
              onClick: () => navigate('/pvp-management-management/scale'),
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
            {
              key: 'users',
              label: 'Users',
              icon: <UserOutlined />,
              onClick: () => navigate('/council/users'),
            },
          ],
        });
      }
    }
    setMenuItems(updatedMenuItems);
  }, [navigate, user.permissions, user.id]);

  const userMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: 'Déconnexion',
          onClick: () => {
            dispatch(resetRoot());
            const clientId = process.env.DISCORD_CLIENT_ID;
            const clientSecret = process.env.DISCORD_CLIENT_SECRET;
            if (clientId && clientSecret)
              axios
                .post(
                  `https://discord.com/api/oauth2/token/revoke`,
                  new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    token: discordToken,
                  }),
                )
                .then(() => {
                  navigate('/');
                });
          },
        },
      ]}
    />
  );

  const renderUser = () => {
    if (user.id) {
      return (
        <Dropdown
          overlay={userMenu}
          arrow
          trigger={['click']}
          className={'user-menu'}
        >
          <Space style={{ color: 'white' }}>
            {user.username}
            <DownOutlined />
          </Space>
        </Dropdown>
      );
    } else {
      return (
        <span
          className={'login'}
          onClick={async () => {
            localStorage.setItem(
              'influstack-returnTo',
              window.location.pathname,
            );
            const clientId = process.env.DISCORD_CLIENT_ID;
            if (clientId) {
              console.log('ok');
              window.location.href = `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${clientId}&scope=identify&state=15773059ghq9183habn&redirect_uri=${encodeURI(
                window.location.origin + '/login',
              )}&prompt=none`;
            }
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
