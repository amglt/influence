import { useSelector } from '@Store/';
import { AppPermissions } from '@Models/root.models';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function Recruitment() {
  const { user } = useSelector((state) => state.root);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.permissions.includes(AppPermissions.IsRecruitment)) {
      navigate('/');
    }
  }, [navigate, user.permissions]);

  return <Outlet />;
}
