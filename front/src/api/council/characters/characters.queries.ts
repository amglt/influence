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
