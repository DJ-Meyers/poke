/**
 * Utilities for reading and writing Pokédex progress to local storage.
 *
 * Progress is stored as a sorted array of Pokémon IDs that have been caught.
 * Storage key format: `dex:{gameDex}`
 * Example: `dex:SV_PALDEA` -> [906, 909, 912]
 */

import {
  GameDex,
  getPokemonIdsForDex,
  getDexesForGame,
  getDexInfo,
  type Game,
} from './dex-data';
import { NATIONAL_DEX_TOTAL } from './national-dex';

export interface DexProgressIdentifier {
  gameDex: GameDex;
}

export interface DexPokemonIdentifier extends DexProgressIdentifier {
  pokemonId: number;
}

const STORAGE_KEY_PREFIX = 'dex';

function buildStorageKey({ gameDex }: DexProgressIdentifier): string {
  return `${STORAGE_KEY_PREFIX}:${gameDex}`;
}

/**
 * Retrieves the list of caught Pokémon IDs for a given dex.
 * Returns an empty array if no progress exists.
 */
export function getProgressForDex({
  gameDex,
}: DexProgressIdentifier): number[] {
  const key = buildStorageKey({ gameDex });
  const stored = localStorage.getItem(key);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((id): id is number => typeof id === 'number');
  } catch {
    return [];
  }
}

/**
 * Checks if a specific Pokémon has been caught in the given dex.
 */
export function getIsCaughtForDex({
  gameDex,
  pokemonId,
}: DexPokemonIdentifier): boolean {
  const progress = getProgressForDex({ gameDex });
  return progress.includes(pokemonId);
}

/**
 * Marks a Pokémon as caught in the given dex.
 * Maintains a sorted array for efficient storage and lookup.
 */
export function markCaughtForDex({
  gameDex,
  pokemonId,
}: DexPokemonIdentifier): void {
  const progress = getProgressForDex({ gameDex });

  if (progress.includes(pokemonId)) {
    return;
  }

  progress.push(pokemonId);
  progress.sort((a, b) => a - b);

  const key = buildStorageKey({ gameDex });
  localStorage.setItem(key, JSON.stringify(progress));
}

/**
 * Marks a Pokémon as not caught in the given dex.
 */
export function markUncaughtForDex({
  gameDex,
  pokemonId,
}: DexPokemonIdentifier): void {
  const progress = getProgressForDex({ gameDex });
  const index = progress.indexOf(pokemonId);

  if (index === -1) {
    return;
  }

  progress.splice(index, 1);

  const key = buildStorageKey({ gameDex });
  localStorage.setItem(key, JSON.stringify(progress));
}

/**
 * Toggles the caught status of a Pokémon in the given dex.
 * Returns the new caught status.
 */
export function toggleCaughtForDex({
  gameDex,
  pokemonId,
}: DexPokemonIdentifier): boolean {
  if (getIsCaughtForDex({ gameDex, pokemonId })) {
    markUncaughtForDex({ gameDex, pokemonId });
    return false;
  } else {
    markCaughtForDex({ gameDex, pokemonId });
    return true;
  }
}

/**
 * Marks all Pokémon in the dex as caught.
 */
export function markAllCaughtForDex({ gameDex }: DexProgressIdentifier): void {
  const pokemonIds = getPokemonIdsForDex({ gameDex });
  const key = buildStorageKey({ gameDex });
  localStorage.setItem(key, JSON.stringify(pokemonIds));
}

/**
 * Resets all progress for a given dex.
 */
export function resetProgressForDex({ gameDex }: DexProgressIdentifier): void {
  const key = buildStorageKey({ gameDex });
  localStorage.removeItem(key);
}

/**
 * Returns the count of caught Pokémon for a given dex.
 */
export function getCaughtCountForDex({
  gameDex,
}: DexProgressIdentifier): number {
  return getProgressForDex({ gameDex }).length;
}

/**
 * Returns the total progress for all dexes in a game.
 * Counts UNIQUE Pokémon - if a Pokémon appears in multiple dexes, it's only counted once.
 */
export function getProgressForGame({ game }: { game: Game }): {
  caughtCount: number;
  totalCount: number;
} {
  const dexes = getDexesForGame({ game });
  const uniquePokemonIds = new Set<number>();
  const uniqueCaughtIds = new Set<number>();

  for (const gameDex of dexes) {
    const dexInfo = getDexInfo({ gameDex });
    const caughtIds = getProgressForDex({ gameDex });

    // Add all Pokémon IDs to the unique set
    for (const id of dexInfo.pokemonIds) {
      uniquePokemonIds.add(id);
    }

    // Add caught IDs to the unique caught set
    for (const id of caughtIds) {
      uniqueCaughtIds.add(id);
    }
  }

  return {
    caughtCount: uniqueCaughtIds.size,
    totalCount: uniquePokemonIds.size,
  };
}

/**
 * Returns the total progress across all games (National Dex).
 * Total is always 1025 (all Pokémon). Caught count is unique across all game dexes.
 */
export function getNationalDexProgress(): {
  caughtCount: number;
  totalCount: number;
} {
  const allDexes = Object.values(GameDex) as GameDex[];
  const uniqueCaughtIds = new Set<number>();

  for (const gameDex of allDexes) {
    const caughtIds = getProgressForDex({ gameDex });

    for (const id of caughtIds) {
      uniqueCaughtIds.add(id);
    }
  }

  return {
    caughtCount: uniqueCaughtIds.size,
    totalCount: NATIONAL_DEX_TOTAL,
  };
}

/**
 * Progress info for a single dex, used for UI display.
 */
export interface DexProgressInfo {
  gameDex: GameDex;
  displayName: string;
  caughtCount: number;
  totalCount: number;
}

/**
 * Builds progress info for multiple dexes.
 * Useful for displaying dex selection with progress bars.
 */
export function buildDexProgressInfo({
  dexes,
}: {
  dexes: GameDex[];
}): DexProgressInfo[] {
  return dexes.map((gameDex) => {
    const dexInfo = getDexInfo({ gameDex });
    const progress = getProgressForDex({ gameDex });
    return {
      gameDex,
      displayName: dexInfo.dexDisplayName,
      caughtCount: progress.length,
      totalCount: dexInfo.pokemonIds.length,
    };
  });
}

// Re-export types and enums for convenience
export { GameDex };
