import { Outlet } from 'react-router-dom';
import { AppPermissions } from '../../models/root.models';
import { useSelector } from '../../store';

export function Influtons() {
  const { user } = useSelector((state) => state.root);

  return !user.permissions.includes(AppPermissions.IsLogistic) ? (
    <div>Vous n'avez pas accès à ce contenu</div>
  ) : (
    <Outlet />
  );
}
