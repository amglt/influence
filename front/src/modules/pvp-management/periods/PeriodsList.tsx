import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { Button, Modal, Space } from 'antd';
import { Listing } from '@Components/Listing';
import { DeleteOutlined } from '@ant-design/icons';
import { ModalConfirmDelete } from '@Components/ModalConfirmDelete';
import { Period } from '@Models/pvp-management.models';
import { usePeriods } from '@Api/pvp-management/pvp-management.queries';
import { format } from 'date-fns';
import {
  useCreatePeriod,
  useDeletePeriod,
} from '@Api/pvp-management/pvp-management.mutations';
import { useState } from 'react';

export function PeriodsList() {
  const [isAddPeriodModalOpen, setIsAddPeriodModalOpen] = useState(false);

  const { data: periodsData, isLoading: arePeriodsLoading } = usePeriods();
  const { mutate: deletePeriod } = useDeletePeriod();
  const { mutate: createPeriod } = useCreatePeriod();

  const onCloseAddPeriodModal = () => {
    setIsAddPeriodModalOpen(false);
  };

  const onAddPeriodOk = () => {
    createPeriod();
    onCloseAddPeriodModal();
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
      <Breadcrumb
        items={[
          { key: 'pvp-management-management', label: 'PVP Management' },
          { key: 'periods', label: 'Périodes' },
        ]}
      />
      <Content>
        <Button type={'primary'} onClick={() => setIsAddPeriodModalOpen(true)}>
          Créer une période
        </Button>
        <Listing<Period>
          columns={[
            {
              key: 'startDate',
              dataIndex: 'startDate',
              title: 'Date de départ',
              filtered: true,
              sorter: (a, b) =>
                new Date(b.startDate).getTime() -
                new Date(a.startDate).getTime(),
              render: (value) => format(new Date(value), 'dd/MM/yyyy hh:mm'),
            },
            {
              key: 'endDate',
              dataIndex: 'endDate',
              title: 'Date de fin',
              filtered: true,
              sorter: (a, b) =>
                a.endDate && b.endDate
                  ? new Date(b.endDate).getTime() -
                    new Date(a.endDate).getTime()
                  : 0,
              render: (value) =>
                value ? format(new Date(value), 'dd/MM/yyyy hh:mm') : undefined,
            },
            {
              key: 'actions',
              dataIndex: 'actions',
              render: (_, record) => {
                return (
                  <Space>
                    <DeleteOutlined
                      onClick={() =>
                        ModalConfirmDelete({
                          title: (
                            <span>
                              Vous êtes sur le point de supprimer la periode
                              allant du{' '}
                              {format(new Date(record.startDate), 'dd/MM/yyyy')}{' '}
                              au{' '}
                              {record.endDate
                                ? format(new Date(record.endDate), 'dd/MM/yyyy')
                                : '?'}
                              . Etes-vous certain de vouloir de le supprimer ?
                            </span>
                          ),
                          content: 'Cette action est irréversible',
                          onOk: () => deletePeriod(record.id),
                        })
                      }
                    />
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
