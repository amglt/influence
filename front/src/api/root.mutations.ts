import { useMutation } from 'react-query';
import { useApi } from '@Hooks/api';
import { User } from '@Models/root.models';

export function useUpdateUserInfo() {
  const { put } = useApi();

  return useMutation((user: User) =>
    put(`/users/${user.user_id}/info`, {
      name: user.name,
      nickname: user.nickname,
      picture: user.picture,
    }),
  );
}
