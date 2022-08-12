import { Outlet } from 'react-router-dom';
import { useCurrentUser } from '../api/root.queries';
import { Layout } from '../components/Layout';
import { useEffect } from 'react';
import { useDispatch } from '../store';
import { setEnabledModules } from '../store/root.slice';
import { EnabledModules } from '../models/root.models';

export function App() {
  const { status: userStatus } = useCurrentUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const enabledModules = process.env.ENABLED_MODULES;
    if (enabledModules) {
      const modules = enabledModules.split(',') as EnabledModules[];
      dispatch(setEnabledModules(modules));
    }
  }, [dispatch]);

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
