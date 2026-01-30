import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import type { Game } from '~/utils/dex-data';
import {
  GameDex,
  getDexesForGame,
  getAllGamesInfo,
  isNationalDex,
  isRegularGameDex,
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
import {
  getDerivedNationalDexData,
  toggleHomeCaught,
  type DexSource,
} from '~/utils/national-dex-derived-progress';
import { queryClient } from './query-client';

// --- Query key factories ---

export const dexProgressKeys = {
  all: ['dex-progress'] as const,
  allGames: ['dex-progress', 'all-games'] as const,
  game: (game: Game) => ['dex-progress', 'game', game] as const,
  gameProgress: (game: Game) =>
    ['dex-progress', 'game', game, 'progress'] as const,
  gameInfo: (game: Game) => ['dex-progress', 'game', game, 'info'] as const,
};

// --- Query option factories (internal) ---

const gameProgressOptions = ({ game }: { game: Game }) => {
  return queryOptions({
    queryKey: dexProgressKeys.gameProgress(game),
    queryFn: () => getProgressForGame({ game }),
  });
};

const dexProgressInfoOptions = ({ game }: { game: Game }) => {
  return queryOptions({
    queryKey: dexProgressKeys.gameInfo(game),
    queryFn: () => {
      const dexes = getDexesForGame({ game });
      return buildDexProgressInfo({ dexes });
    },
  });
};

export interface GameProgressInfo {
  game: Game;
  displayName: string;
  caughtCount: number;
  totalCount: number;
}

const allGamesProgressOptions = () => {
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
};

export interface AllDexProgressData {
  /** Caught IDs indexed by GameDex (including NATIONAL). */
  caughtIdsByDex: Record<GameDex, Set<number>>;
  /** Caught IDs indexed by Game (union of all dexes within a game), plus HOME. For origin marks. */
  caughtIdsByGame: Record<DexSource, Set<number>>;
}

const allDexProgressOptions = () => {
  return queryOptions({
    queryKey: [...dexProgressKeys.all, 'all-dex'] as const,
    queryFn: (): AllDexProgressData => {
      // Get national dex derived data (includes caughtByGame for origin marks)
      const nationalData = getDerivedNationalDexData();

      // Build caughtIdsByDex for each dex
      const caughtIdsByDex = {} as Record<GameDex, Set<number>>;

      for (const gameDex of Object.values(GameDex)) {
        if (isRegularGameDex(gameDex)) {
          caughtIdsByDex[gameDex] = new Set(getProgressForDex({ gameDex }));
        } else {
          // NATIONAL uses the derived caught IDs (caught in HOME or any game)
          caughtIdsByDex[gameDex] = nationalData.caughtIds;
        }
      }

      // Convert Map to Record for caughtIdsByGame
      const caughtIdsByGame = {} as Record<DexSource, Set<number>>;
      for (const [key, value] of nationalData.caughtByGame) {
        caughtIdsByGame[key] = value;
      }

      return {
        caughtIdsByDex,
        caughtIdsByGame,
      };
    },
  });
};

// --- Hooks (for components) ---

const EMPTY_BY_DEX: Record<GameDex, Set<number>> = Object.fromEntries(
  Object.values(GameDex).map((dex) => [dex, new Set<number>()])
) as Record<GameDex, Set<number>>;
const EMPTY_BY_GAME: Record<DexSource, Set<number>> = {} as Record<
  DexSource,
  Set<number>
>;

/**
 * Returns progress for all dexes including NATIONAL.
 * - caughtIdsByDex: indexed by GameDex enum values
 * - caughtIdsByGame: indexed by Game enum values (plus 'HOME')
 */
export const useDexProgress = (): AllDexProgressData => {
  const { data } = useQuery(allDexProgressOptions());
  return {
    caughtIdsByDex: data?.caughtIdsByDex ?? EMPTY_BY_DEX,
    caughtIdsByGame: data?.caughtIdsByGame ?? EMPTY_BY_GAME,
  };
};

export const useGameProgress = ({ game }: { game: Game }) => {
  const { data } = useQuery(gameProgressOptions({ game }));
  return {
    caughtCount: data?.caughtCount ?? 0,
    totalCount: data?.totalCount ?? 0,
  };
};

export const useDexProgressInfo = ({ game }: { game: Game }) => {
  const { data } = useQuery(dexProgressInfoOptions({ game }));
  return { dexProgressInfo: data ?? [] };
};

export const useAllGamesProgress = () => {
  const { data } = useQuery(allGamesProgressOptions());
  return {
    games: data?.games ?? [],
    nationalDexProgress: data?.nationalDexProgress ?? {
      caughtCount: 0,
      totalCount: 0,
    },
  };
};

// --- Mutations ---

/**
 * Toggle caught status for any dex, including NATIONAL.
 * For NATIONAL, toggles the HOME storage. For regular dexes, toggles the dex-specific storage.
 */
export const useToggleDexCaught = () => {
  return useMutation({
    mutationFn: ({
      gameDex,
      pokemonId,
    }: {
      gameDex: GameDex;
      pokemonId: number;
    }) => {
      if (isNationalDex(gameDex)) {
        toggleHomeCaught(pokemonId);
      } else {
        toggleCaughtForDex({ gameDex, pokemonId });
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dexProgressKeys.all });
    },
  });
};

export const useCompleteDex = () => {
  return useMutation({
    mutationFn: ({ gameDex }: { gameDex: GameDex }) => {
      markAllCaughtForDex({ gameDex });
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dexProgressKeys.all });
    },
  });
};

export const useResetDex = () => {
  return useMutation({
    mutationFn: ({ gameDex }: { gameDex: GameDex }) => {
      resetProgressForDex({ gameDex });
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dexProgressKeys.all });
    },
  });
};

export type { DexProgressInfo, DexSource };
