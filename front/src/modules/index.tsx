import { Outlet } from 'react-router-dom';
import { useCurrentUser } from '../api/root.queries';
import { Layout } from '../components/Layout';

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
