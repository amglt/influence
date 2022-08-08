import { useSelector } from '@Store/';
import { AppPermissions } from '@Models/root.models';
import { Outlet } from 'react-router-dom';

export function Recruitment() {
  const { user } = useSelector((state) => state.root);

  return !user.permissions.includes(AppPermissions.IsRecruitment) ? (
    <div>Vous n'avez pas accès à ce contenu</div>
  ) : (
    <Outlet />
  );
}
