import { Listing } from '@Components/Listing';
import { User } from '@Models/root.models';
import { useUsers } from '@Api/council/users/users.queries';
import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { ColumnsType } from 'antd/lib/table';
import { format } from 'date-fns';
import { Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ModalConfirmDelete } from '@Components/ModalConfirmDelete';
import { useDeleteUser, useEditUser } from '@Api/council/users/users.mutations';
import { EditUserModal } from '@Modules/council/users/EditUserModal';
import { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { useRoles } from '@Api/council/roles/roles.queries';

export function UsersList() {
  const { data: usersData } = useUsers();
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles();

  const { mutate: editUser } = useEditUser();
  const { mutate: deleteUser } = useDeleteUser();

  const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
  const [editUserForm] = useForm();
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const onCloseEditUserModal = () => {
    setSelectedUser(undefined);
    setIsEditUserModalVisible(false);
  };

  const onSaveEditUser = () => {
    if (selectedUser) {
      const selectedRole = rolesData?.find(
        (role) => role.id === editUserForm.getFieldValue('role'),
      );
      if (selectedRole)
        editUser({
          userId: selectedUser.user_id,
          body: { role: selectedRole },
        });
      onCloseEditUserModal();
    }
  };

  const columns: ColumnsType<User> = [
    {
      key: 'pic',
      dataIndex: 'picture',
      width: 50,
      render: (value, record) => {
        return (
          <img
            style={{ borderRadius: '50%' }}
            src={value}
            alt={`${record.user_id}-picture`}
            height={30}
            width={30}
          />
        );
      },
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: `Nom d'utilisateur`,
      filtered: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      key: 'last_login',
      dataIndex: 'last_login',
      title: 'Dernière connexion',
      render: (value) => format(new Date(value), 'dd/MM/yyyy hh:mm'),
      filtered: true,
      sorter: (a, b) =>
        new Date(b.last_login).getTime() - new Date(a.last_login).getTime(),
    },
    {
      key: 'created_at',
      dataIndex: 'created_at',
      title: 'Date de création',
      render: (value) => format(new Date(value), 'dd/MM/yyyy'),
      filtered: true,
      sorter: (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    },
    {
      key: 'actions',
      render: (_, record) => (
        <Space>
          <EditOutlined
            onClick={() => {
              setSelectedUser(record);
              setIsEditUserModalVisible(true);
            }}
          />
          <DeleteOutlined
            onClick={() =>
              ModalConfirmDelete({
                title: (
                  <span>
                    Êtes-vous certain de vouloir supprimer l'utilisateur
                    <strong>{record.name}</strong> ?
                  </span>
                ),
                content: `Cette action est irréversible`,
                onOk: () => deleteUser(record.user_id),
              })
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'council', label: 'Conseil' },
          { key: 'roles', label: 'Utilisateurs' },
        ]}
      />
      <Content>
        <EditUserModal
          isVisible={isEditUserModalVisible}
          onCancel={onCloseEditUserModal}
          onOk={onSaveEditUser}
          form={editUserForm}
          selectedUser={selectedUser}
          roles={rolesData ?? []}
          isLoadingRoles={isLoadingRoles}
        />
        <Listing<User> columns={columns} data={usersData ?? []} />
      </Content>
    </>
  );
}
