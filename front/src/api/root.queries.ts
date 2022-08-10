import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { AppUser } from '@Models/root.models';
import { useSelector } from '@Store/';

export function useCurrentUser() {
  const { get } = useApi();
  const { user } = useSelector((state) => state.root);

  return useQuery(['user'], () => get<AppUser>(`/users/me`), {
    enabled: !!user.id,
  });
}
