import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from '@Modules/';
import { Council } from '@Modules/council';
import { RolesList } from '@Modules/council/roles/RolesList';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<App />}>
          <Route path={'conseil'} element={<Council />}>
            <Route path={'roles'} element={<RolesList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
