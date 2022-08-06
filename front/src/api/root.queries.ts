import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { AppUser } from '@Models/root.models';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from '@Store/';
import { setUser } from '@Store/root.slice';

export function useCurrentUser() {
  const { get } = useApi();
  const { user } = useAuth0();
  const dispatch = useDispatch();

  return useQuery(['user'], () => get<AppUser>(`/users/me`), {
    enabled: !!user?.sub,
    onSuccess: (data: AppUser) => {
      dispatch(setUser({ ...data, permissions: [] }));
    },
  });
}

export function useUserPermissions() {
  const { get } = useApi();
  const { user } = useSelector((state) => state.root);
  const dispatch = useDispatch();

  return useQuery(
    ['user-permissions', user.user_id],
    () => get<string[]>(`/management/users/${user.user_id}/permissions`),
    {
      enabled: !!user?.user_id,
      onSuccess: (data: string[]) => {
        dispatch(setUser({ ...user, permissions: data }));
      },
    },
  );
}
