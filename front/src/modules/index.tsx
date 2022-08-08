import { Layout } from '@Components/Layout';
import { Outlet } from 'react-router-dom';
import { useCurrentUser } from '@Api/root.queries';

export function App() {
  const { status: userStatus } = useCurrentUser();

  const renderApp = () => {
    if (userStatus === 'loading') {
      return <Layout>Chargement de l'utilisateur...</Layout>;
    } else {
      return (
        <Layout>
          <Outlet />
        </Layout>
      );
    }
  };

  return <>{renderApp()}</>;
}
