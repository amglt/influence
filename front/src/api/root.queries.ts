import { useQuery } from 'react-query';
import { useApi } from '../hooks/api';
import { useSelector } from '../store';
import { AppUser } from '../models/root.models';

export function useCurrentUser() {
  const { get } = useApi();
  const { user } = useSelector((state) => state.root);

  return useQuery(['user'], () => get<AppUser>(`/users/me`), {
    enabled: !!user.id,
  });
}
