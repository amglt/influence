import { useQuery } from 'react-query';
import { useApi } from '@Hooks/api';
import { Character } from '@Models/character.model';
import { FormInstance } from 'antd';

export enum CharactersQueriesKey {
  Characters = 'Characters',
  Character = 'Character',
}

export function useCharacters() {
  const { get } = useApi();

  return useQuery(CharactersQueriesKey.Characters, () =>
    get<Character[]>('/characters'),
  );
}

export function useCharacter(id?: number, form?: FormInstance) {
  const { get } = useApi();
  return useQuery(
    [CharactersQueriesKey.Character, id],
    () => get<Character>(`characters/${id}`),
    {
      enabled: !!id,
      onSuccess: (character) => {
        form?.setFieldsValue({
          name: character.name,
          class: character.class,
          rank: character.rank,
          accountName: character.account.name,
          discordId: character.account.userId.split('|').pop(),
          recruitmentDate: character.recruitmentDate,
        });
      },
    },
  );
}
