import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { Listing } from '@Components/Listing';
import { Character } from '@Models/character.model';
import { Button, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  useCharacters,
  useCharacter,
} from '@Api/recruitment/characters/characters.queries';
import {
  useAddCharacter,
  useDeleteCharacter,
  useEditCharacter,
} from '@Api/recruitment/characters/characters.mutations';
import { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { AddEditCharacterModal } from './AddEditCharacterModal';
import { useAccounts } from '@Api/recruitment/accounts/accounts.queries';
import { ModalConfirmDelete } from '@Components/ModalConfirmDelete';
import { format } from '@Utils';

export function CharactersList() {
  const [isAddEditCharacterModalOpen, setIsAddEditCharacterModalOpen] =
    useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<
    Character | undefined
  >();
  const [addEditCharacterForm] = useForm();

  const { data: charactersData, isLoading: isLoadingCharacters } =
    useCharacters();
  const { data: characterData, isLoading: isCharacterLoading } = useCharacter(
    selectedCharacter?.id,
    addEditCharacterForm,
  );
  const { data: accountsData } = useAccounts();

  const { mutate: deleteCharacter } = useDeleteCharacter();
  const { mutate: createCharacter } = useAddCharacter();
  const { mutate: editCharacter } = useEditCharacter();

  const closeAddEditCharacterModal = () => {
    setSelectedCharacter(undefined);
    addEditCharacterForm.resetFields();
    setIsAddEditCharacterModalOpen(false);
  };

  const handleOnOkCreateCharacter = async () => {
    try {
      await addEditCharacterForm.validateFields();
      const name = addEditCharacterForm.getFieldValue('name');
      const classe = addEditCharacterForm.getFieldValue('class');
      const rank = addEditCharacterForm.getFieldValue('rank');
      const accountId = addEditCharacterForm.getFieldValue('accountId');
      const recruitmentDate =
        addEditCharacterForm.getFieldValue('recruitmentDate');
      if (selectedCharacter) {
        editCharacter({
          characterId: selectedCharacter.id,
          body: { name, class: classe, rank, accountId, recruitmentDate },
        });
      } else {
        createCharacter({
          name,
          class: classe,
          rank,
          accountId,
          recruitmentDate,
        });
      }
      closeAddEditCharacterModal();
    } catch {}
  };

  return (
    <>
      <AddEditCharacterModal
        isOpen={isAddEditCharacterModalOpen}
        onCancel={closeAddEditCharacterModal}
        onOk={handleOnOkCreateCharacter}
        form={addEditCharacterForm}
        accounts={accountsData ?? []}
        selectedCharacter={characterData}
        isLoadingCharacter={isCharacterLoading}
      />
      <Breadcrumb
        items={[
          { key: 'recruitment', label: 'Recrutement' },
          { key: 'characters', label: 'Personnages' },
        ]}
      />
      <Content>
        <Button
          type={'primary'}
          onClick={() => setIsAddEditCharacterModalOpen(true)}
        >
          Ajouter un personnage
        </Button>
        <Listing<Character>
          columns={[
            {
              key: 'name',
              dataIndex: 'name',
              title: 'Pseudo',
              filtered: true,
              sorter: (a, b) => a.name.localeCompare(b.name),
            },
            {
              key: 'class',
              dataIndex: 'class',
              title: 'Classe',
              filtered: true,
              sorter: (a, b) => a.class.localeCompare(b.class),
            },
            {
              key: 'rank',
              dataIndex: 'rank',
              title: 'Rang',
              filtered: true,
              sorter: (a, b) => a.rank.localeCompare(b.rank),
            },
            {
              key: 'accountName',
              dataIndex: ['account', 'name'],
              title: 'Compte',
              filtered: true,
              sorter: (a, b) => a.account.name.localeCompare(b.account.name),
            },
            {
              key: 'recruitmentDate',
              dataIndex: 'recruitmentDate',
              title: 'Date de recrutement',
              filtered: true,
              sorter: (a, b) =>
                new Date(a.recruitmentDate).getTime() -
                new Date(b.recruitmentDate).getTime(),
              render: (value) => format(new Date(value)),
            },
            {
              key: 'actions',
              dataIndex: 'actions',
              render: (_, record) => {
                return (
                  <Space>
                    <EditOutlined
                      onClick={() => {
                        setSelectedCharacter(record);
                        setIsAddEditCharacterModalOpen(true);
                      }}
                    />
                    <DeleteOutlined
                      onClick={() => {
                        ModalConfirmDelete({
                          title: (
                            <span>
                              Etes-vous sûr de vouloir supprimer le personnage
                              <strong> {record.name}</strong> ?
                            </span>
                          ),
                          content: 'Cette action est irréversible.',
                          onOk: () => deleteCharacter(record.id),
                        });
                      }}
                    />
                  </Space>
                );
              },
            },
          ]}
          data={charactersData}
          loading={isLoadingCharacters}
        />
      </Content>
    </>
  );
}
