import { Layout } from '@Components/layout';
import { Outlet } from 'react-router-dom';
import { useUser } from '@Api/queries/root.queries';

export function App() {
  const { isLoading } = useUser();

  return (
    <Layout isLoadingUser={isLoading}>
      <Outlet />
    </Layout>
  );
}
