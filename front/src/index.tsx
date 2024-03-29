import { createRoot } from 'react-dom/client';
import './styles/root.less';
import { Providers } from './providers';
import { Router } from './Router';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Providers>
    <Router />
  </Providers>,
);
