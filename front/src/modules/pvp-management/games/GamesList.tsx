import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { Space } from 'antd';
import { Listing } from '@Components/Listing';
import { DeleteOutlined } from '@ant-design/icons';
import { ModalConfirmDelete } from '@Components/ModalConfirmDelete';
import {
  PvpGame,
  PvpGameResult,
  PvpGameStatus,
  PvpGameType,
} from '@Models/pvp-management.models';
import { useGames } from '@Api/pvp-management/pvp-management.queries';
import { format } from 'date-fns';
import { getPlayersStringFromPvpGame } from '@Utils';

export function GamesList() {
  const { data: gamesData, isLoading: areGamesLoading } = useGames();

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'pvp-management-management', label: 'PVP Management' },
          { key: 'periods', label: 'Parties' },
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
            {
              key: 'actions',
              dataIndex: 'actions',
              render: (_, record) => {
                return (
                  <Space>
                    <DeleteOutlined />
                  </Space>
                );
              },
            },
          ]}
          data={gamesData}
          loading={areGamesLoading}
        />
      </Content>
    </>
  );
}
