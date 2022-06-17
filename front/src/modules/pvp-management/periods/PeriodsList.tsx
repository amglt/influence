import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { Space } from 'antd';
import { Listing } from '@Components/Listing';
import { DeleteOutlined } from '@ant-design/icons';
import { ModalConfirmDelete } from '@Components/ModalConfirmDelete';
import { Period } from '@Models/pvp-management.models';
import { usePeriods } from '@Api/pvp-management/pvp-management.queries';
import { format } from 'date-fns';
import { useDeletePeriod } from '@Api/pvp-management/pvp-management.mutations';

export function PeriodsList() {
  const { data: periodsData, isLoading: arePeriodsLoading } = usePeriods();
  const { mutate: deletePeriod } = useDeletePeriod();

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'pvp-management-management', label: 'PVP Management' },
          { key: 'periods', label: 'Périodes' },
        ]}
      />
      <Content>
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
                              allant du {format(record.startDate, 'dd/MM/yyyy')}{' '}
                              au{' '}
                              {record.endDate
                                ? format(record.endDate, 'dd/MM/yyyy')
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
