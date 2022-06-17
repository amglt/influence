import { useSelector } from '@Store/';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AppPermissions } from '@Models/root.models';

export function PvpManagement() {
  const { user } = useSelector((state) => state.root);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.permissions.includes(AppPermissions.IsPVPManager)) {
      navigate('/');
    }
  }, [navigate, user.permissions]);

  return <Outlet />;
}
