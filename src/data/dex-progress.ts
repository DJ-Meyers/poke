import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import type { Game, GameDex } from '~/utils/dex-data';
import {
  getDexesForGame,
  getAllGamesInfo,
  getGameForDex,
} from '~/utils/dex-data';
import {
  getProgressForDex,
  getProgressForGame,
  toggleCaughtForDex,
  markAllCaughtForDex,
  resetProgressForDex,
  buildDexProgressInfo,
  getNationalDexProgress,
  type DexProgressInfo,
} from '~/utils/dex-progress';
import { queryClient } from './query-client';

// --- Query key factories ---

export const dexProgressKeys = {
  all: ['dex-progress'] as const,
  allGames: ['dex-progress', 'all-games'] as const,
  game: (game: Game) => ['dex-progress', 'game', game] as const,
  gameProgress: (game: Game) =>
    ['dex-progress', 'game', game, 'progress'] as const,
  gameInfo: (game: Game) => ['dex-progress', 'game', game, 'info'] as const,
  dex: (game: Game, gameDex: GameDex) =>
    ['dex-progress', 'game', game, 'dex', gameDex] as const,
};

// --- Query option factories (internal) ---

function dexProgressOptions({ gameDex }: { gameDex: GameDex }) {
  const game = getGameForDex({ gameDex });
  return queryOptions({
    queryKey: dexProgressKeys.dex(game, gameDex),
    queryFn: () => getProgressForDex({ gameDex }),
  });
}

function gameProgressOptions({ game }: { game: Game }) {
  return queryOptions({
    queryKey: dexProgressKeys.gameProgress(game),
    queryFn: () => getProgressForGame({ game }),
  });
}

function dexProgressInfoOptions({ game }: { game: Game }) {
  return queryOptions({
    queryKey: dexProgressKeys.gameInfo(game),
    queryFn: () => {
      const dexes = getDexesForGame({ game });
      return buildDexProgressInfo({ dexes });
    },
  });
}

export interface GameProgressInfo {
  game: Game;
  displayName: string;
  caughtCount: number;
  totalCount: number;
}

function allGamesProgressOptions() {
  return queryOptions({
    queryKey: dexProgressKeys.allGames,
    queryFn: () => {
      const allGames = getAllGamesInfo();
      const reversedGames = [...allGames].reverse();

      const games: GameProgressInfo[] = reversedGames.map((gameInfo) => {
        const progress = getProgressForGame({ game: gameInfo.game });
        return {
          game: gameInfo.game,
          displayName: gameInfo.displayName,
          caughtCount: progress.caughtCount,
          totalCount: progress.totalCount,
        };
      });

      const nationalDexProgress = getNationalDexProgress();

      return { games, nationalDexProgress };
    },
  });
}

// --- Hooks (for components) ---

export function useDexProgress({ gameDex }: { gameDex: GameDex }) {
  const { data } = useQuery(dexProgressOptions({ gameDex }));
  return { caughtIds: data ?? [] };
}

export function useGameProgress({ game }: { game: Game }) {
  const { data } = useQuery(gameProgressOptions({ game }));
  return {
    caughtCount: data?.caughtCount ?? 0,
    totalCount: data?.totalCount ?? 0,
  };
}

export function useDexProgressInfo({ game }: { game: Game }) {
  const { data } = useQuery(dexProgressInfoOptions({ game }));
  return { dexProgressInfo: data ?? [] };
}

export function useAllGamesProgress() {
  const { data } = useQuery(allGamesProgressOptions());
  return {
    games: data?.games ?? [],
    nationalDexProgress: data?.nationalDexProgress ?? {
      caughtCount: 0,
      totalCount: 0,
    },
  };
}

// --- Mutations ---

export function useToggleDexCaught() {
  return useMutation({
    mutationFn: ({
      gameDex,
      pokemonId,
    }: {
      gameDex: GameDex;
      pokemonId: number;
    }) => {
      toggleCaughtForDex({ gameDex, pokemonId });
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dexProgressKeys.all });
    },
  });
}

export function useCompleteDex() {
  return useMutation({
    mutationFn: ({ gameDex }: { gameDex: GameDex }) => {
      markAllCaughtForDex({ gameDex });
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dexProgressKeys.all });
    },
  });
}

export function useResetDex() {
  return useMutation({
    mutationFn: ({ gameDex }: { gameDex: GameDex }) => {
      resetProgressForDex({ gameDex });
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dexProgressKeys.all });
    },
  });
}

export type { DexProgressInfo };
