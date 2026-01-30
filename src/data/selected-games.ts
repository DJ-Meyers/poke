import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import type { Game } from '~/utils/dex-data';
import {
  getSelectedGames,
  setSelectedGames,
  toggleGameSelection,
} from '~/utils/selected-games';
import { queryClient } from './query-client';

// --- Query option factories (internal) ---

const selectedGamesOptions = () => {
  return queryOptions({
    queryKey: ['selected-games'],
    queryFn: () => getSelectedGames(),
  });
};

// --- Hooks (for components) ---

export const useSelectedGames = () => {
  const { data } = useQuery(selectedGamesOptions());
  return { selectedGames: data ?? [] };
};

// --- Mutations ---

export const useToggleGameSelection = () => {
  return useMutation({
    mutationFn: ({ game }: { game: Game }) => {
      toggleGameSelection({ game });
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selected-games'] });
    },
  });
};

export const useSetSelectedGames = () => {
  return useMutation({
    mutationFn: ({ games }: { games: Game[] }) => {
      setSelectedGames({ games });
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selected-games'] });
    },
  });
};
