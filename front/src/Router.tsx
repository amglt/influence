import { Route, Routes } from 'react-router-dom';
import { App } from './modules';
import { Login } from './modules/login';
import { useSelector } from './store';
import { EnabledModules } from './models/root.models';
import { Influtons } from './modules/influtons';
import { WalletsList } from './modules/influtons/wallets/WalletsList';
import { TransactionsList } from './modules/influtons/transactions/TransactionsList';
import { PvpManagement } from './modules/pvp-management';
import { PeriodsList } from './modules/pvp-management/periods/PeriodsList';
import { PeriodGamesList } from './modules/pvp-management/periods/PeriodGamesList';
import { PeriodPlayersPointsList } from './modules/pvp-management/periods/PeriodPlayerPointsList';
import { PeriodPlayerGamesList } from './modules/pvp-management/periods/PeriodPlayerGamesList';
import { Scale } from './modules/pvp-management/scale/Scale';
import { Council } from './modules/council';
import { RolesList } from './modules/council/roles/RolesList';
import { UsersList } from './modules/council/users/UsersList';
import { Recruitment } from './modules/recruitment';
import { AccountsList } from './modules/recruitment/accounts/AccountsList';
import { CharactersList } from './modules/recruitment/characters/CharactersList';

export function Router() {
  const { enabledModules } = useSelector((state) => state.root);

  return (
    <Routes>
      <Route path={'/'} element={<App />}>
        <Route path={'login'} element={<Login />} />
        {enabledModules.includes(EnabledModules.Influtons) && (
          <Route path={'influtons'} element={<Influtons />}>
            <Route path={'wallets'} element={<WalletsList />} />
            <Route path={'history'} element={<TransactionsList />} />
          </Route>
        )}
        {enabledModules.includes(EnabledModules.Recruitment) && (
          <Route path={'recruitment'} element={<Recruitment />}>
            <Route path={'accounts'} element={<AccountsList />} />
            <Route path={'characters'} element={<CharactersList />} />
          </Route>
        )}
        {enabledModules.includes(EnabledModules.Pvp) && (
          <Route path={'pvp-management'} element={<PvpManagement />}>
            <Route path={'periods'} element={<PeriodsList />} />
            <Route
              path={'periods/:periodId/games'}
              element={<PeriodGamesList />}
            />
            <Route
              path={'periods/:periodId/players'}
              element={<PeriodPlayersPointsList />}
            />
            <Route
              path={'periods/:periodId/games/:playerId'}
              element={<PeriodPlayerGamesList />}
            />
            <Route path={'scale'} element={<Scale />} />
          </Route>
        )}
        <Route path={'council'} element={<Council />}>
          <Route path={'roles'} element={<RolesList />} />
          <Route path={'users'} element={<UsersList />} />
        </Route>
      </Route>
    </Routes>
  );
}
