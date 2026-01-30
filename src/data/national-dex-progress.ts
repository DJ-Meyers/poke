import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import {
  getDerivedNationalDexData,
  toggleHomeCaught,
  type DerivedNationalDexData,
} from '~/utils/national-dex-derived-progress';
import { dexProgressKeys } from './dex-progress';
import { queryClient } from './query-client';

// --- Query option factories (internal) ---

const nationalDexDerivedOptions = () => {
  return queryOptions({
    queryKey: [...dexProgressKeys.all, 'national-derived'] as const,
    queryFn: (): DerivedNationalDexData => getDerivedNationalDexData(),
  });
};

// --- Hooks (for components) ---

const EMPTY_CAUGHT = new Set<number>();
const EMPTY_BY_GAME = new Map() as DerivedNationalDexData['caughtByGame'];

export const useNationalDexDerived = (): DerivedNationalDexData => {
  const { data } = useQuery(nationalDexDerivedOptions());
  return {
    caughtIds: data?.caughtIds ?? EMPTY_CAUGHT,
    caughtByGame: data?.caughtByGame ?? EMPTY_BY_GAME,
  };
};

// --- Mutations ---

export const useToggleHomeCaught = () => {
  return useMutation({
    mutationFn: ({ pokemonId }: { pokemonId: number }) => {
      toggleHomeCaught(pokemonId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dexProgressKeys.all });
    },
  });
};
