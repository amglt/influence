import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { Listing } from '@Components/Listing';
import { PeriodPlayerWithPoints } from '@Models/pvp-management.models';
import { usePeriodPlayers } from '@Api/pvp-management/pvp-management.queries';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Space } from 'antd';
import { EyeOutlined, CheckOutlined } from '@ant-design/icons';
import { useEditPeriodRewarded } from '@Api/pvp-management/pvp-management.mutations';

export function PeriodPlayersPointsList() {
  const params = useParams();
  const navigate = useNavigate();

  const { data: gamesData, isLoading: areGamesLoading } = usePeriodPlayers(
    params.periodId,
  );
  const { mutate: payPlayer } = useEditPeriodRewarded();

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'pvp-management-management', label: 'PVP Management' },
          { key: 'periodsPlayers', label: 'Joueurs et points' },
        ]}
      />
      <Content>
        <Listing<PeriodPlayerWithPoints>
          columns={[
            {
              key: 'playerName',
              dataIndex: 'player',
              title: 'Joueur',
              filtered: true,
              sorter: (a, b) =>
                a.player.nickname.localeCompare(b.player.nickname),
              render: (value) => value.nickname,
            },
            {
              key: 'points',
              title: 'Total points',
              dataIndex: 'totalPoints',
              filtered: true,
              sorter: (a, b) => a.totalPoints - b.totalPoints,
            },
            {
              key: 'reward',
              dataIndex: 'reward',
              title: 'Récompense',
              filtered: true,
              sorter: (a, b) => a.reward - b.reward,
            },
            {
              key: 'rewarded',
              dataIndex: 'rewarded',
              title: 'Payé ?',
              filtered: true,
              sorter: (a, b) => Number(a.rewarded) - Number(b.rewarded),
              render: (value, record) =>
                value ? (
                  <CheckOutlined />
                ) : (
                  <Button
                    onClick={() => {
                      payPlayer({
                        periodId: record.periodId,
                        playerId: record.playerId,
                        rewarded: true,
                      });
                    }}
                  >
                    Payer
                  </Button>
                ),
            },
            {
              key: 'actions',
              render: (_, record) => (
                <Space>
                  <EyeOutlined
                    onClick={() => {
                      navigate(
                        `/pvp-management-management/periods/${params.periodId}/games/${record.playerId}`,
                      );
                    }}
                  />
                </Space>
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
