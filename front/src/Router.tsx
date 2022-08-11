import { Routes, Route } from 'react-router-dom';
import { App } from '@Modules/';
import { Council } from '@Modules/council';
import { RolesList } from '@Modules/council/roles/RolesList';
import { AccountsList } from '@Modules/recruitment/accounts/AccountsList';
import { Recruitment } from '@Modules/recruitment';
import { CharactersList } from '@Modules/recruitment/characters/CharactersList';
import { UsersList } from '@Modules/council/users/UsersList';
import { PeriodsList } from '@Modules/pvp-management/periods/PeriodsList';
import { PvpManagement } from '@Modules/pvp-management';
import { Scale } from '@Modules/pvp-management/scale/Scale';
import { PeriodGamesList } from '@Modules/pvp-management/periods/PeriodGamesList';
import { PeriodPlayersPointsList } from '@Modules/pvp-management/periods/PeriodPlayerPointsList';
import { PeriodPlayerGamesList } from '@Modules/pvp-management/periods/PeriodPlayerGamesList';
import { Login } from '@Modules/login';
import { WalletsList } from '@Modules/influtons/wallets/WalletsList';
import { Influtons } from '@Modules/influtons';
import { TransactionsList } from '@Modules/influtons/transactions/TransactionsList';

export function Router() {
  return (
    <Routes>
      <Route path={'/'} element={<App />}>
        <Route path={'login'} element={<Login />} />
        <Route path={'influtons'} element={<Influtons />}>
          <Route path={'wallets'} element={<WalletsList />} />
          <Route path={'history'} element={<TransactionsList />} />
        </Route>
        <Route path={'recruitment'} element={<Recruitment />}>
          <Route path={'accounts'} element={<AccountsList />} />
          <Route path={'characters'} element={<CharactersList />} />
        </Route>
        <Route path={'pvp-management-management'} element={<PvpManagement />}>
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
        <Route path={'council'} element={<Council />}>
          <Route path={'roles'} element={<RolesList />} />
          <Route path={'users'} element={<UsersList />} />
        </Route>
      </Route>
    </Routes>
  );
}
