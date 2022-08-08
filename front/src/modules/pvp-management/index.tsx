import { useSelector } from '@Store/';
import { Outlet } from 'react-router-dom';
import { AppPermissions } from '@Models/root.models';

export function PvpManagement() {
  const { user } = useSelector((state) => state.root);

  return !user.permissions.includes(AppPermissions.IsPVPManager) ? (
    <div>Vous n'avez pas accès à ce contenu</div>
  ) : (
    <Outlet />
  );
}
