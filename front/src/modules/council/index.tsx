import { Outlet } from 'react-router-dom';
import { useSelector } from '@Store/';
import { AppPermissions } from '@Models/root.models';

export function Council() {
  const { user } = useSelector((state) => state.root);

  return !user.permissions.includes(AppPermissions.IsCouncil) ? (
    <div>Vous n'avez pas accès à ce contenu</div>
  ) : (
    <Outlet />
  );
}
