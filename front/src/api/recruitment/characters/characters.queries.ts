import { useQuery } from 'react-query';
import { FormInstance } from 'antd';
import { useApi } from '../../../hooks/api';
import { Character } from '../../../models/character.model';

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
    () => get<Character>(`/characters/${id}`),
    {
      enabled: !!id,
      onSuccess: (character) => {
        form?.setFieldsValue({
          name: character.name,
          class: character.class,
          rank: character.rank,
          accountId: character.account.id,
          recruitmentDate: new Date(character.recruitmentDate),
        });
      },
    },
  );
}
