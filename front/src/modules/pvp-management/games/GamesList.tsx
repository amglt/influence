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
