import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { Listing } from '@Components/Listing';
import { Character } from '@Models/character.model';
import { Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useCharacters } from '@Api/council/characters/characters.queries';

export function CharactersList() {
  const { data: charactersData, isLoading: isLoadingCharacters } =
    useCharacters();

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'recruitment', label: 'Recrutement' },
          { key: 'characters', label: 'Characters' },
        ]}
      />
      <Content>
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
              key: 'accountId',
              dataIndex: 'accountId',
              title: 'Compte',
              filtered: true,
              sorter: (a, b) => a.account.name.localeCompare(b.account.name),
            },
            {
              key: 'discordTag',
              dataIndex: 'discordTag',
              title: 'Discord',
              filtered: true,
              sorter: (a, b) => a.discordTag.localeCompare(b.discordTag),
            },
            {
              key: 'recruitmentDate',
              dataIndex: 'recruitmentDate',
              title: 'Date de recrutement',
              filtered: true,
              sorter: (a, b) =>
                moment(a.recruitmentDate).unix() -
                moment(b.recruitmentDate).unix(),
            },
            {
              key: 'actions',
              dataIndex: 'actions',
              render: (_, record) => {
                return (
                  <Space>
                    <EditOutlined />
                    <DeleteOutlined />
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
