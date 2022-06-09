import { usePermissions, useRoles } from '@Api/council/roles/roles.queries';
import { Listing } from '@Components/listing';
import { Breadcrumb } from '@Components/breadcrumb';
import { Content } from '@Components/content';
import { Permission, Role } from '@Models/root.models';
import { DeleteOutlined } from '@ant-design/icons';
import { useAddRole, useDeleteRole } from '@Api/council/roles/roles.mutations';
import { Button, FormInstance } from 'antd';
import { useState } from 'react';
import { AddRoleModal } from '@Modules/council/roles/AddRoleModal';
import { useForm } from 'antd/lib/form/Form';
import { ModalConfirmDelete } from '@Components/modalconfirmdelete';

export function RolesList() {
  const { data, isLoading } = useRoles();
  const { mutate: deleteRole } = useDeleteRole();

  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [addRoleForm] = useForm();

  const { data: permissionsData } = usePermissions();

  const { mutate: createRole } = useAddRole();

  const closeAddRoleModal = () => {
    addRoleForm.resetFields();
    setIsAddRoleModalOpen(false);
  };

  const generateRoleBody = (form: FormInstance) => {
    const name = form.getFieldValue('name');
    const description = form.getFieldValue('description');
    const permissions: Permission[] = [];
    const permissionsNames = form.getFieldValue('permissions') as string[];
    for (const perm of permissionsNames) {
      if (permissionsData) {
        const relatedPerm = permissionsData.find(
          (p) => p.permission_name === perm,
        );
        if (relatedPerm) permissions.push(relatedPerm);
      }
    }
    return {
      name,
      description,
      permissions,
    };
  };

  const handleOnOkCreateRole = async () => {
    try {
      await addRoleForm.validateFields();
      createRole({ ...generateRoleBody(addRoleForm) });
      closeAddRoleModal();
    } catch {}
  };

  return (
    <>
      <AddRoleModal
        isOpen={isAddRoleModalOpen}
        onCancel={closeAddRoleModal}
        onOk={handleOnOkCreateRole}
        form={addRoleForm}
        permissions={permissionsData ?? []}
      />
      <Breadcrumb
        items={[
          { key: 'council', label: 'Conseil' },
          { key: 'roles', label: 'Roles' },
        ]}
      />
      <Content>
        <Button type={'primary'} onClick={() => setIsAddRoleModalOpen(true)}>
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
                  <DeleteOutlined
                    onClick={() =>
                      ModalConfirmDelete({
                        title: (
                          <span>
                            Vous êtes sur le point de supprimer le role{' '}
                            <strong>{record.name}</strong>. Etes-vous certain de
                            vouloir de le supprimer ?
                          </span>
                        ),
                        content: 'Cette action est irréversible',
                        onOk: () => deleteRole(record.id),
                      })
                    }
                  />
                ) : (
                  <span />
                );
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
