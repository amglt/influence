import { Outlet } from 'react-router-dom';
import { useSelector } from '../../store';
import { AppPermissions } from '../../models/root.models';

export function Recruitment() {
  const { user } = useSelector((state) => state.root);

  return !user.permissions.includes(AppPermissions.IsRecruitment) ? (
    <div>Vous n'avez pas accès à ce contenu</div>
  ) : (
    <Outlet />
  );
}
