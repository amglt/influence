import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from '@Modules/';
import { Council } from '@Modules/council';
import { RolesList } from '@Modules/council/roles/RolesList';
import { AccountsList } from '@Modules/recruitment/accounts/AccountsList';
import { Recruitment } from '@Modules/recruitment';
import { UsersList } from '@Modules/council/users/UsersList';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<App />}>
          <Route path={'recruitment'} element={<Recruitment />}>
            <Route path={'accounts'} element={<AccountsList />} />
          </Route>
          <Route path={'council'} element={<Council />}>
            <Route path={'roles'} element={<RolesList />} />
            <Route path={'users'} element={<UsersList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
