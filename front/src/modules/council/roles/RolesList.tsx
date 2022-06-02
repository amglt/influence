import { useRoles } from '@Api/council/roles.queries';
import { Listing } from '@Components/listing';
import { Breadcrumb } from '@Components/breadcrumb';
import { Content } from '@Components/content';
import { Role } from '@Models/root.models';
import { DeleteOutlined } from '@ant-design/icons';
import { useDeleteRole } from '@Api/council/roles.mutations';

export function RolesList() {
  const { data, isLoading } = useRoles();
  const { mutate: deleteRole } = useDeleteRole();

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'council', label: 'Conseil' },
          { key: 'roles', label: 'Roles' },
        ]}
      />
      <Content>
        <Listing<Role>
          columns={[
            {
              key: 'name',
              dataIndex: 'name',
              title: 'Nom',
              filtered: true,
              sorter: (a, b) => a.name.localeCompare(b.name),
            },
            {
              key: 'description',
              dataIndex: 'description',
              title: 'Description',
              filtered: true,
              sorter: (a, b) => a.description.localeCompare(b.description),
            },
            {
              key: 'actions',
              dataIndex: 'actions',
              render: (_, record) => {
                return <DeleteOutlined onClick={() => deleteRole(record.id)} />;
              },
            },
          ]}
          data={data}
          loading={isLoading}
        />
      </Content>
    </>
  );
}
