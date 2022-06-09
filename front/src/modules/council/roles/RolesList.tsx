import {
  usePermissions,
  useRole,
  useRoles,
} from '@Api/council/roles/roles.queries';
import { Listing } from '@Components/listing';
import { Breadcrumb } from '@Components/breadcrumb';
import { Content } from '@Components/content';
import { Permission, Role } from '@Models/root.models';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  useAddRole,
  useDeleteRole,
  useEditRole,
} from '@Api/council/roles/roles.mutations';
import { Button, Space } from 'antd';
import { useState } from 'react';
import { AddEditRoleModal } from '@Modules/council/roles/AddEditRoleModal';
import { useForm } from 'antd/lib/form/Form';
import { ModalConfirmDelete } from '@Components/modalconfirmdelete';

export function RolesList() {
  const [isAddEditRoleModalOpen, setIsAddEditRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const [addEditRoleForm] = useForm();

  console.log(selectedRole);

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
      const description = addEditRoleForm.getFieldValue('description');
      const permissions: Permission[] = [];
      const permissionsNames = addEditRoleForm.getFieldValue(
        'permissions',
      ) as string[];
      for (const perm of permissionsNames) {
        if (permissionsData) {
          const relatedPerm = permissionsData.find(
            (p) => p.permission_name === perm,
          );
          if (relatedPerm) permissions.push(relatedPerm);
        }
      }
      if (selectedRole) {
        editRole({
          id: selectedRole.id,
          body: { name, description, permissions },
        });
      } else {
        createRole({ name, description, permissions });
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
