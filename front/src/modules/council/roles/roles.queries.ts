import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';

export function useRoles() {
  const { get } = useApi();

  return useQuery('roles', () => get(''));
}
