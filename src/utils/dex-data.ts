/**
 * Utility functions for working with Pokédex data.
 * Data constants are imported from ~/data/dex.
 */

import {
  GameDex,
  Game,
  DEX_DATA,
  GAME_DEXES,
  type DexDataEntry,
  type RegularGameDex,
} from '../../data/dex';
import { getNationalDexPokemonIds } from './national-dex';

// Re-export types and enums for convenience
export { GameDex, Game, type DexDataEntry, type RegularGameDex };

/**
 * Returns true if the given gameDex is the National Dex.
 * Acts as a type guard to narrow GameDex to 'NATIONAL'.
 */
export const isNationalDex = (
  gameDex: GameDex
): gameDex is typeof GameDex.NATIONAL => {
  return gameDex === GameDex.NATIONAL;
};

/**
 * Type guard that narrows GameDex to RegularGameDex (excludes NATIONAL).
 */
export const isRegularGameDex = (
  gameDex: GameDex
): gameDex is RegularGameDex => {
  return gameDex !== GameDex.NATIONAL;
};

export interface DexInfo {
  gameDex: GameDex;
  game: Game;
  gameDisplayName: string;
  dexDisplayName: string;
  pokemonIds: number[];
}

export interface GameInfo {
  game: Game;
  displayName: string;
  dexes: RegularGameDex[];
}

/**
 * Pre-computed map of Pokemon IDs for each dex.
 * Lazily initialized on first access.
 */
let pokemonIdsByDexCache: Record<GameDex, number[]> | null = null;

/**
 * Returns a map of all dex Pokemon IDs, computed once and cached.
 * Use this instead of getPokemonIdsForDex when you need IDs for multiple dexes
 * or want to avoid repeated memoization in render loops.
 */
export const getPokemonIdsByDex = (): Record<GameDex, number[]> => {
  if (!pokemonIdsByDexCache) {
    const result = {} as Record<GameDex, number[]>;
    for (const gameDex of Object.values(GameDex)) {
      if (isRegularGameDex(gameDex)) {
        result[gameDex] = DEX_DATA[gameDex].pokemonIds;
      } else {
        result[gameDex] = getNationalDexPokemonIds();
      }
    }
    pokemonIdsByDexCache = result;
  }
  return pokemonIdsByDexCache;
};

/**
 * Returns the list of Pokémon IDs for a given game dex.
 */
export const getPokemonIdsForDex = ({
  gameDex,
}: {
  gameDex: GameDex;
}): number[] => {
  return getPokemonIdsByDex()[gameDex];
};

/**
 * Returns the total number of Pokémon in a given dex.
 * Does not support NATIONAL - use getPokemonIdsForDex instead.
 */
export const getDexSize = ({ gameDex }: { gameDex: GameDex }): number => {
  return DEX_DATA[gameDex as RegularGameDex].pokemonIds.length;
};

/**
 * Returns full info for a game dex.
 * Does not support NATIONAL - throws error if passed.
 */
export const getDexInfo = ({ gameDex }: { gameDex: GameDex }): DexInfo => {
  if (isNationalDex(gameDex)) {
    throw new Error('getDexInfo does not support NATIONAL dex');
  }
  const data = DEX_DATA[gameDex as RegularGameDex];
  return {
    gameDex,
    game: data.game,
    gameDisplayName: data.gameDisplayName,
    dexDisplayName: data.dexDisplayName,
    pokemonIds: data.pokemonIds,
  };
};

/**
 * Returns all available games.
 */
export const getAllGames = (): Game[] => {
  return Object.values(Game);
};

/**
 * Returns all game dexes.
 */
export const getAllGameDexes = (): GameDex[] => {
  return Object.values(GameDex);
};

/**
 * Returns all dexes for a given game.
 */
export const getDexesForGame = ({ game }: { game: Game }): RegularGameDex[] => {
  return GAME_DEXES[game];
};

/**
 * Returns the default dex for a game (first dex).
 */
export const getDefaultDex = ({ game }: { game: Game }): RegularGameDex => {
  return GAME_DEXES[game][0];
};

/**
 * Returns the game for a given game dex.
 * Does not support NATIONAL - throws error if passed.
 */
export const getGameForDex = ({ gameDex }: { gameDex: GameDex }): Game => {
  if (isNationalDex(gameDex)) {
    throw new Error('getGameForDex does not support NATIONAL dex');
  }
  return DEX_DATA[gameDex as RegularGameDex].game;
};

/**
 * Returns full game info including all dexes.
 */
export const getGameInfo = ({ game }: { game: Game }): GameInfo => {
  const firstDex = GAME_DEXES[game][0];
  return {
    game,
    displayName: DEX_DATA[firstDex].gameDisplayName,
    dexes: GAME_DEXES[game],
  };
};

/**
 * Returns info for all games.
 */
export const getAllGamesInfo = (): GameInfo[] => {
  return getAllGames().map((game) => getGameInfo({ game }));
};

/**
 * Returns the display name for a game.
 */
export const getGameDisplayName = ({ game }: { game: Game }): string => {
  const firstDex = GAME_DEXES[game][0];
  return DEX_DATA[firstDex].gameDisplayName;
};

/**
 * Returns the display name for a dex.
 * Does not support NATIONAL - throws error if passed.
 */
export const getDexDisplayName = ({
  gameDex,
}: {
  gameDex: GameDex;
}): string => {
  if (isNationalDex(gameDex)) {
    throw new Error('getDexDisplayName does not support NATIONAL dex');
  }
  return DEX_DATA[gameDex as RegularGameDex].dexDisplayName;
};

/**
 * Returns a formatted label combining game abbreviation and dex name.
 * Example: "SV • Paldea Dex"
 * Does not support NATIONAL - throws error if passed.
 */
export const getDexLabel = ({ gameDex }: { gameDex: GameDex }): string => {
  if (isNationalDex(gameDex)) {
    throw new Error('getDexLabel does not support NATIONAL dex');
  }
  const data = DEX_DATA[gameDex as RegularGameDex];
  return `${data.game} • ${data.dexDisplayName}`;
};
