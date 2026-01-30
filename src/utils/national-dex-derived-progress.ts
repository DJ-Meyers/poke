/**
 * Derives national dex caught status from all per-game-dex localStorage entries.
 * A Pokémon is "caught" in the national dex if it's caught in HOME or ANY game dex.
 */

import {
  type Game,
  GameDex,
  DEX_DATA,
  type DexDataEntry,
} from '../../data/dex';
import { getProgressForDex } from './dex-progress';
import { isNationalDex } from './dex-data';

export const HOME_STORAGE_KEY = 'dex:HOME';

export type DexSource = Game | 'HOME';

export interface DerivedNationalDexData {
  /** Pokémon IDs caught in HOME or ANY game dex. */
  caughtIds: Set<number>;
  /** Per-game caught sets (union of all dexes within a game), plus HOME. */
  caughtByGame: Map<DexSource, Set<number>>;
}

const readHomeProgress = (): number[] => {
  const stored = localStorage.getItem(HOME_STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is number => typeof id === 'number');
  } catch {
    return [];
  }
};

export const toggleHomeCaught = (pokemonId: number): boolean => {
  const progress = readHomeProgress();
  const index = progress.indexOf(pokemonId);
  if (index !== -1) {
    progress.splice(index, 1);
    localStorage.setItem(HOME_STORAGE_KEY, JSON.stringify(progress));
    return false;
  } else {
    progress.push(pokemonId);
    progress.sort((a, b) => a - b);
    localStorage.setItem(HOME_STORAGE_KEY, JSON.stringify(progress));
    return true;
  }
};

export const getDerivedNationalDexData = (): DerivedNationalDexData => {
  const caughtIds = new Set<number>();
  const caughtByGame = new Map<DexSource, Set<number>>();

  // Read HOME progress
  const homeProgress = readHomeProgress();
  const homeSet = new Set<number>();
  caughtByGame.set('HOME', homeSet);
  for (const id of homeProgress) {
    caughtIds.add(id);
    homeSet.add(id);
  }

  // Read per-game-dex progress (skip NATIONAL as it doesn't have DEX_DATA)
  for (const gameDex of Object.values(GameDex) as GameDex[]) {
    if (isNationalDex(gameDex)) continue;
    const dexData = (DEX_DATA as Record<string, DexDataEntry>)[gameDex];
    const game = dexData.game;
    const progress = getProgressForDex({ gameDex });

    let gameSet = caughtByGame.get(game);
    if (!gameSet) {
      gameSet = new Set<number>();
      caughtByGame.set(game, gameSet);
    }

    for (const id of progress) {
      caughtIds.add(id);
      gameSet.add(id);
    }
  }

  return { caughtIds, caughtByGame };
};
