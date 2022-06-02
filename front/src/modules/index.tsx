import { Layout } from '@Components/layout';
import { Outlet } from 'react-router-dom';
import { useUser, useUserPermissions } from '@Api/root.queries';

export function App() {
  const { isLoading: isLoadingUser } = useUser();
  const { isLoading: isLoadingUserPermissions } = useUserPermissions();

  return (
    <Layout
      isLoadingUser={isLoadingUser}
      isLoadingPermissions={isLoadingUserPermissions}
    >
      <Outlet />
    </Layout>
  );
}
