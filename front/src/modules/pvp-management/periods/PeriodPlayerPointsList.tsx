import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { Listing } from '@Components/Listing';
import { PeriodPlayerPoints, PvpGame } from '@Models/pvp-management.models';
import { usePeriodPlayers } from '@Api/pvp-management/pvp-management.queries';
import { useNavigate, useParams } from 'react-router-dom';
import { Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

export function PeriodPlayersPointsList() {
  const params = useParams();
  const navigate = useNavigate();

  const { data: gamesData, isLoading: areGamesLoading } = usePeriodPlayers(
    params.periodId,
  );

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'pvp-management-management', label: 'PVP Management' },
          { key: 'periodsPlayers', label: 'Joueurs et points' },
        ]}
      />
      <Content>
        <Listing<PeriodPlayerPoints>
          columns={[
            {
              key: 'playerId',
              dataIndex: 'playerId',
              title: 'Joueur',
            },
            {
              key: 'points',
              title: 'Total points',
              dataIndex: 'totalPoints',
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
