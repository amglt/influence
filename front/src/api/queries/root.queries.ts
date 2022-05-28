import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { UserWithRole } from '@Models/root.models';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from '@Store/';
import { setUser } from '@Store/root.slice';

export function useUser() {
  const { get } = useApi();
  const { user } = useAuth0();
  const dispatch = useDispatch();
  return useQuery(
    ['user', user?.sub],
    () => get<UserWithRole>(`/users/${user?.sub}`),
    {
      enabled: !!user?.sub,
      onSuccess: (data: UserWithRole) => {
        dispatch(setUser(data));
      },
    },
  );
}
