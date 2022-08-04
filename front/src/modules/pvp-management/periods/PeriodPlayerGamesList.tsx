import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { Listing } from '@Components/Listing';
import {
  PvpGame,
  PvpGameResult,
  PvpGameType,
} from '@Models/pvp-management.models';
import { usePeriodPlayerGames } from '@Api/pvp-management/pvp-management.queries';
import { useParams } from 'react-router-dom';
import { getPlayersStringFromPvpGame } from '@Utils';

export function PeriodPlayerGamesList() {
  const params = useParams();

  const { data: gamesData, isLoading: areGamesLoading } = usePeriodPlayerGames(
    params.periodId,
    params.playerId,
  );

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'pvp-management-management', label: 'PVP Management' },
          { key: 'periodGames', label: 'Parties pendant période' },
        ]}
      />
      <Content>
        <Listing<PvpGame>
          columns={[
            {
              key: 'id',
              dataIndex: 'id',
              title: 'ID',
              width: 50,
            },
            {
              key: 'result',
              dataIndex: 'result',
              title: 'Résultat',
              render: (value) => PvpGameResult[value],
            },
            {
              key: 'type',
              dataIndex: 'type',
              title: 'Type',
              render: (value) => PvpGameType[value],
            },
            {
              key: 'players',
              title: 'Joueurs',
              render: (_, record) => getPlayersStringFromPvpGame(record),
            },
            {
              key: 'screenshot',
              dataIndex: 'screenshotUrl',
              title: 'Screenshot',
              render: (value, record) => (
                <a target={'_blank'} href={value}>
                  <img
                    src={value}
                    alt={`screen-${record.id}`}
                    width={100}
                    height={50}
                  />
                </a>
              ),
            },
          ]}
          data={gamesData}
          loading={areGamesLoading}
        />
      </Content>
    </>
  );
}
