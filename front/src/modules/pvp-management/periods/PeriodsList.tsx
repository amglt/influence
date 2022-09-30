import { Button, Modal, Space } from 'antd';
import { EyeOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { useSelector } from '../../../store';
import { Period } from '../../../models/pvp-management.models';
import { usePeriods } from '../../../api/pvp-management/pvp-management.queries';
import {
  useCreatePeriod,
  useEditPeriodReward,
} from '../../../api/pvp-management/pvp-management.mutations';
import { EditPeriodModal } from './EditPeriodModal';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { Content } from '../../../components/Content';
import { AppPermissions } from '../../../models/root.models';
import { Listing } from '../../../components/Listing';
import { format } from '../../../utils';

export function PeriodsList() {
  const { user } = useSelector((state) => state.root);
  const [isAddPeriodModalOpen, setIsAddPeriodModalOpen] = useState(false);
  const [isEditPeriodModalOpen, setIsEditPeriodModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | undefined>(
    undefined,
  );
  const [editPeriodForm] = useForm();
  const navigate = useNavigate();

  const { data: periodsData, isLoading: arePeriodsLoading } = usePeriods();
  /*const { mutate: deletePeriod } = useDeletePeriod();*/
  const { mutate: createPeriod } = useCreatePeriod();
  const { mutate: editPeriodReward } = useEditPeriodReward();

  const onCloseAddPeriodModal = () => {
    setIsAddPeriodModalOpen(false);
  };

  const onAddPeriodOk = () => {
    createPeriod();
    onCloseAddPeriodModal();
  };

  const onCloseEditPeriodModal = () => {
    setIsEditPeriodModalOpen(false);
    setSelectedPeriod(undefined);
  };

  const onEditPeriodRewardOk = () => {
    if (selectedPeriod) {
      editPeriodReward({
        periodId: selectedPeriod.id,
        reward: editPeriodForm.getFieldValue('reward'),
      });
      onCloseEditPeriodModal();
    }
  };

  return (
    <>
      <Modal
        title={'Créer une nouvelle période'}
        visible={isAddPeriodModalOpen}
        okText={'Valider'}
        cancelText={'Annuler'}
        onOk={onAddPeriodOk}
        onCancel={onCloseAddPeriodModal}
        width={'70vw'}
      >
        Êtes-vous sur de vouloir créer une nouvelle période ? Cela clotura tout
        période actuellement ouverte.
      </Modal>
      <EditPeriodModal
        isVisible={isEditPeriodModalOpen}
        onCancel={onCloseEditPeriodModal}
        onOk={onEditPeriodRewardOk}
        form={editPeriodForm}
        selectedPeriod={selectedPeriod}
      />
      <Breadcrumb
        items={[
          { key: 'pvp-management', label: 'PVP Management' },
          { key: 'periods', label: 'Périodes' },
        ]}
      />
      <Content>
        {user.permissions.includes(AppPermissions.WritePeriods) && (
          <Button
            type={'primary'}
            onClick={() => setIsAddPeriodModalOpen(true)}
          >
            Créer une période
          </Button>
        )}
        <Listing<Period>
          columns={[
            {
              key: 'startDate',
              dataIndex: 'startDate',
              title: 'Date de départ',
              filtered: true,
              onFilter: (value, record) =>
                String(record.startDate)
                  .toLowerCase()
                  .includes((value as string).toLowerCase()),
              sorter: (a, b) =>
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime(),
              render: (value) => format(new Date(value)),
            },
            {
              key: 'endDate',
              dataIndex: 'endDate',
              title: 'Date de fin',
              filtered: true,
              onFilter: (value, record) =>
                String(record.endDate)
                  .toLowerCase()
                  .includes((value as string).toLowerCase()),
              sorter: (a, b) =>
                a.endDate && b.endDate
                  ? new Date(b.endDate).getTime() -
                    new Date(a.endDate).getTime()
                  : 0,
              render: (value) => (value ? format(new Date(value)) : undefined),
            },
            {
              key: 'reward',
              dataIndex: 'reward',
              title: 'Récompense totale',
            },
            {
              key: 'actions',
              render: (_, record) => {
                return (
                  <Space>
                    {user.permissions.includes(AppPermissions.WritePeriods) && (
                      <EditOutlined
                        onClick={() => {
                          setSelectedPeriod(record);
                          setIsEditPeriodModalOpen(true);
                        }}
                      />
                    )}
                    <EyeOutlined
                      onClick={() => {
                        navigate(`${record.id}/games`);
                      }}
                    />
                    <UserOutlined
                      onClick={() => {
                        navigate(`${record.id}/players`);
                      }}
                    />
                    {/*{user.permissions.includes(
                      AppPermissions.DeletePeriods,
                    ) && (
                      <DeleteOutlined
                        onClick={() =>
                          ModalConfirmDelete({
                            title: (
                              <span>
                                Vous êtes sur le point de supprimer la periode
                                allant du {format(new Date(record.startDate))}{' '}
                                au{' '}
                                {record.endDate
                                  ? format(new Date(record.endDate))
                                  : '?'}
                                . Etes-vous certain de vouloir de le supprimer ?
                              </span>
                            ),
                            content: 'Cette action est irréversible',
                            onOk: () => deletePeriod(record.id),
                          })
                        }
                      />
                    )}*/}
                  </Space>
                );
              },
            },
          ]}
          data={periodsData}
          loading={arePeriodsLoading}
        />
      </Content>
    </>
  );
}
