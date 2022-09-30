import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { Permission, Role } from '../../../models/root.models';
import {
  usePermissions,
  useRole,
  useRoles,
} from '../../../api/council/roles/roles.queries';
import {
  useAddRole,
  useDeleteRole,
  useEditRole,
} from '../../../api/council/roles/roles.mutations';
import { AddEditRoleModal } from './AddEditRoleModal';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { Content } from '../../../components/Content';
import { Listing } from '../../../components/Listing';
import { ModalConfirmDelete } from '../../../components/ModalConfirmDelete';

export function RolesList() {
  const [isAddEditRoleModalOpen, setIsAddEditRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const [addEditRoleForm] = useForm();

  const { data: rolesData, isLoading: isLoadingRoles } = useRoles();
  const { data: roleData, isLoading: isRoleLoading } = useRole(
    selectedRole?.id,
    addEditRoleForm,
  );
  const { data: permissionsData } = usePermissions();

  const { mutate: deleteRole } = useDeleteRole();
  const { mutate: createRole } = useAddRole();
  const { mutate: editRole } = useEditRole();

  const closeAddEditRoleModal = () => {
    setSelectedRole(undefined);
    addEditRoleForm.resetFields();
    setIsAddEditRoleModalOpen(false);
  };

  const handleOnOkCreateRole = async () => {
    try {
      await addEditRoleForm.validateFields();
      const name = addEditRoleForm.getFieldValue('name');
      const permissions: Permission[] =
        addEditRoleForm.getFieldValue('permissions');

      if (selectedRole) {
        editRole({
          id: selectedRole.id,
          body: { name, permissions },
        });
      } else {
        createRole({ name, permissions });
      }
      closeAddEditRoleModal();
    } catch {}
  };

  return (
    <>
      <AddEditRoleModal
        isOpen={isAddEditRoleModalOpen}
        onCancel={closeAddEditRoleModal}
        onOk={handleOnOkCreateRole}
        form={addEditRoleForm}
        permissions={permissionsData ?? []}
        selectedRole={roleData}
        isLoadingRole={isRoleLoading}
      />
      <Breadcrumb
        items={[
          { key: 'council', label: 'Conseil' },
          { key: 'roles', label: 'Roles' },
        ]}
      />
      <Content>
        <Button
          type={'primary'}
          onClick={() => setIsAddEditRoleModalOpen(true)}
        >
          Ajouter un role
        </Button>
        <Listing<Role>
          columns={[
            {
              key: 'name',
              dataIndex: 'name',
              title: 'Nom',
              filtered: true,
              onFilter: (value, record) =>
                record.name
                  .toLowerCase()
                  .includes((value as string).toLowerCase()),
              sorter: (a, b) => a.name.localeCompare(b.name),
            },
            {
              key: 'actions',
              dataIndex: 'actions',
              render: (_, record) => {
                return record.id !== process.env.COUNCIL_ROLE_ID ? (
                  <Space>
                    <EditOutlined
                      onClick={() => {
                        setSelectedRole(record);
                        setIsAddEditRoleModalOpen(true);
                      }}
                    />
                    <DeleteOutlined
                      onClick={() =>
                        ModalConfirmDelete({
                          title: (
                            <span>
                              Vous êtes sur le point de supprimer le role{' '}
                              <strong>{record.name}</strong>. Etes-vous certain
                              de vouloir de le supprimer ?
                            </span>
                          ),
                          content: 'Cette action est irréversible',
                          onOk: () => deleteRole(record.id),
                        })
                      }
                    />
                  </Space>
                ) : (
                  <span />
                );
              },
            },
          ]}
          data={rolesData}
          loading={isLoadingRoles}
        />
      </Content>
    </>
  );
}
