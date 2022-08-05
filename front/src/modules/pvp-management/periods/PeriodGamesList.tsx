import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { Listing } from '@Components/Listing';
import {
  PvpGame,
  PvpGameResult,
  PvpGameStatus,
  PvpGameType,
} from '@Models/pvp-management.models';
import { usePeriodGames } from '@Api/pvp-management/pvp-management.queries';
import { useParams } from 'react-router-dom';
import { getPlayersStringFromPvpGame } from '@Utils';

export function PeriodGamesList() {
  const params = useParams();

  const { data: gamesData, isLoading: areGamesLoading } = usePeriodGames(
    params.periodId,
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
              key: 'status',
              dataIndex: 'status',
              title: 'Status',
              render: (value) => PvpGameStatus[value],
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
          data={gamesData?.games ?? []}
          loading={areGamesLoading}
        />
      </Content>
    </>
  );
}
