import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from '@Modules/';
import { Council } from '@Modules/council';
import { RolesList } from '@Modules/council/roles/RolesList';
import { AccountsList } from '@Modules/recruitment/accounts/AccountsList';
import { Recruitment } from '@Modules/recruitment';
import { CharactersList } from '@Modules/recruitment/characters/CharactersList';
import { UsersList } from '@Modules/council/users/UsersList';
import { PeriodsList } from '@Modules/pvp-management/periods/PeriodsList';
import { PvpManagement } from '@Modules/pvp-management';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/'} element={<App />}>
          <Route path={'recruitment'} element={<Recruitment />}>
            <Route path={'accounts'} element={<AccountsList />} />
            <Route path={'characters'} element={<CharactersList />} />
          </Route>
          <Route path={'pvp-management-management'} element={<PvpManagement />}>
            <Route path={'periods'} element={<PeriodsList />} />
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
