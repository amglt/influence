import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { Listing } from '@Components/Listing';
import {
  PvpGame,
  PvpGameResult,
  PvpGameStatus,
  PvpGameType,
} from '@Models/pvp-management.models';
import {
  PvpManagementQueriesKeys,
  usePeriodGames,
} from '@Api/pvp-management/pvp-management.queries';
import { useParams } from 'react-router-dom';
import { format, getPlayersStringFromPvpGame } from '@Utils';
import { Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { UpdateGameModal } from '@Components/UpdateGameModal';
import { useForm } from 'antd/lib/form/Form';
import {
  useDeleteGame,
  useEditGame,
} from '@Api/pvp-management/pvp-management.mutations';
import { useQueryClient } from 'react-query';
import { ModalConfirmDelete } from '@Components/ModalConfirmDelete';

export function PeriodGamesList() {
  const params = useParams();

  const [isEditGameModalOpen, setIsEditGameModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<PvpGame | undefined>(
    undefined,
  );
  const queryClient = useQueryClient();
  const [editGameForm] = useForm();

  const onSuccessEditOrDeleteGame = async () => {
    await queryClient.refetchQueries([PvpManagementQueriesKeys.PeriodGames]);
    setSelectedGame(undefined);
    setIsEditGameModalOpen(false);
    editGameForm.resetFields();
  };

  const { data: gamesData, isLoading: areGamesLoading } = usePeriodGames(
    params.periodId,
  );
  const { mutate: updateGame } = useEditGame(onSuccessEditOrDeleteGame);
  const { mutate: deleteGame } = useDeleteGame(onSuccessEditOrDeleteGame);

  const onValidateUpdateGame = () => {
    if (selectedGame)
      updateGame({
        gameId: selectedGame.id,
        status: editGameForm.getFieldValue('status'),
        isBigOpponent: editGameForm.getFieldValue('isBigOpponent'),
      });
  };

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'pvp-management-management', label: 'PVP Management' },
          { key: 'periodGames', label: 'Parties pendant période' },
        ]}
      />
      <Content>
        <UpdateGameModal
          isOpen={isEditGameModalOpen}
          onOk={onValidateUpdateGame}
          onCancel={() => {
            setIsEditGameModalOpen(false);
            setSelectedGame(undefined);
          }}
          form={editGameForm}
        />
        <Listing<PvpGame>
          columns={[
            {
              key: 'id',
              dataIndex: 'id',
              title: 'ID',
              filtered: true,
              sorter: (a, b) => a.id - b.id,
              width: 50,
            },
            {
              key: 'timestamp',
              dataIndex: 'timestamp',
              title: 'Date',
              render: (value) => format(new Date(value)),
            },
            {
              key: 'result',
              dataIndex: 'result',
              title: 'Résultat',
              filtered: true,
              sorter: (a, b) => a.result - b.result,
              render: (value) => PvpGameResult[value],
            },
            {
              key: 'type',
              dataIndex: 'type',
              title: 'Type',
              filtered: true,
              sorter: (a, b) => a.type - b.type,
              render: (value) => PvpGameType[value],
            },
            {
              key: 'status',
              dataIndex: 'status',
              title: 'Statut',
              filtered: true,
              sorter: (a, b) => a.status - b.status,
              render: (value) => PvpGameStatus[value],
            },
            {
              key: 'players',
              title: 'Joueurs',
              filtered: true,
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
              render: (_, record) => {
                return (
                  <Space>
                    <EditOutlined
                      onClick={() => {
                        setSelectedGame(record);
                        setIsEditGameModalOpen(true);
                      }}
                    />
                    <DeleteOutlined
                      onClick={() =>
                        ModalConfirmDelete({
                          title:
                            'Vous êtes sur le point de supprimer une partie pvp',
                          content: 'Cette action est irréversible',
                          onOk: () => deleteGame(record.id),
                        })
                      }
                    />
                  </Space>
                );
              },
            },
          ]}
          data={gamesData?.games ?? []}
          loading={areGamesLoading}
        />
      </Content>
    </>
  );
}
