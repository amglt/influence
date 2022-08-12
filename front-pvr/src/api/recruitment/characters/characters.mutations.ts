import { CharactersQueriesKey } from './characters.queries';
import { useMutation, useQueryClient } from 'react-query';
import { useApi } from '../../../hooks/api';

export function useDeleteCharacter() {
  const { del } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    (characterId: number) => del(`/characters/${characterId}`),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(CharactersQueriesKey.Characters);
      },
    },
  );
}

export function useAddCharacter() {
  const { post } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    (body: {
      name: string;
      class: string;
      rank: string;
      accountId: string;
      recruitmentDate: Date;
    }) => post(`/characters`, body),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(CharactersQueriesKey.Characters);
      },
    },
  );
}

export function useEditCharacter() {
  const { put } = useApi();
  const queryClient = useQueryClient();

  return useMutation(
    (request: {
      characterId: number;
      body: {
        name: string;
        class: string;
        rank: string;
        accountId: string;
        recruitmentDate: Date;
      };
    }) => put(`/characters/${request.characterId}`, { ...request.body }),
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(CharactersQueriesKey.Characters);
      },
    },
  );
}
