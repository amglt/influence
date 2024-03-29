import { useNavigate, useParams } from 'react-router-dom';
import { Button, Space } from 'antd';
import { EyeOutlined, CheckOutlined } from '@ant-design/icons';
import { usePeriodPlayers } from '../../../api/pvp-management/pvp-management.queries';
import { useSelector } from '../../../store';
import { useEditPeriodRewarded } from '../../../api/pvp-management/pvp-management.mutations';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { Content } from '../../../components/Content';
import { Listing } from '../../../components/Listing';
import { PeriodPlayerWithPoints } from '../../../models/pvp-management.models';
import { AppPermissions } from '../../../models/root.models';

export function PeriodPlayersPointsList() {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.root);

  const { data: gamesData, isLoading: areGamesLoading } = usePeriodPlayers(
    params.periodId,
  );
  const { mutate: payPlayer } = useEditPeriodRewarded();

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'pvp-management', label: 'PVP Management' },
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
              onFilter: (value, record) =>
                record.player.nickname
                  .toLowerCase()
                  .includes((value as string).toLowerCase()),
              sorter: (a, b) =>
                a.player.nickname.localeCompare(b.player.nickname),
              render: (value) => value.nickname,
            },
            {
              key: 'guild',
              dataIndex: 'player',
              title: 'Guilde',
              filtered: true,
              onFilter: (value, record) =>
                record.player.guild
                  .toLowerCase()
                  .includes((value as string).toLowerCase()),
              sorter: (a, b) => a.player.guild.localeCompare(b.player.guild),
              render: (value) => value.guild,
            },
            {
              key: 'points',
              title: 'Total points',
              dataIndex: 'totalPoints',
              sorter: (a, b) => a.totalPoints - b.totalPoints,
            },
            {
              key: 'reward',
              dataIndex: 'reward',
              title: 'Récompense',
              sorter: (a, b) => a.reward - b.reward,
            },
            {
              key: 'rewarded',
              dataIndex: 'rewarded',
              title: 'Payé ?',
              sorter: (a, b) => Number(a.rewarded) - Number(b.rewarded),
              render: (value, record) => {
                if (value) return <CheckOutlined />;
                if (user.permissions.includes(AppPermissions.WritePeriods)) {
                  return (
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
                  );
                }
                return <span />;
              },
            },
            {
              key: 'actions',
              render: (_, record) => (
                <Space>
                  <EyeOutlined
                    onClick={() => {
                      navigate(
                        `/pvp-management/periods/${params.periodId}/games/${record.playerId}`,
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
