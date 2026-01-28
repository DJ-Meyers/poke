import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import type { Game } from '~/utils/dex-data';
import { getSelectedGames, toggleGameSelection } from '~/utils/selected-games';
import { queryClient } from './query-client';

// --- Query option factories (internal) ---

function selectedGamesOptions() {
  return queryOptions({
    queryKey: ['selected-games'],
    queryFn: () => getSelectedGames(),
  });
}

// --- Hooks (for components) ---

export function useSelectedGames() {
  const { data } = useQuery(selectedGamesOptions());
  return { selectedGames: data ?? [] };
}

// --- Mutations ---

export function useToggleGameSelection() {
  return useMutation({
    mutationFn: ({ game }: { game: Game }) => {
      toggleGameSelection({ game });
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selected-games'] });
    },
  });
}
