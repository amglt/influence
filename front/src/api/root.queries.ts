import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { AppUser } from '@Models/root.models';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from '@Store/';
import { setUser } from '@Store/root.slice';

export function useCurrentUser() {
  const { get } = useApi();
  const { user } = useAuth0();
  const dispatch = useDispatch();

  return useQuery(['user'], () => get<AppUser>(`/users/me`), {
    enabled: !!user?.sub,
    onSuccess: (data: AppUser) => {
      dispatch(setUser({ ...data, id: Number(data.id) }));
    },
  });
}
