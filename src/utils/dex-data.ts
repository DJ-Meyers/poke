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
} from '../../data/dex';

// Re-export types and enums for convenience
export { GameDex, Game, type DexDataEntry };

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
  dexes: GameDex[];
}

/**
 * Returns the list of Pokémon IDs for a given game dex.
 */
export function getPokemonIdsForDex({
  gameDex,
}: {
  gameDex: GameDex;
}): number[] {
  return DEX_DATA[gameDex].pokemonIds;
}

/**
 * Returns the total number of Pokémon in a given dex.
 */
export function getDexSize({ gameDex }: { gameDex: GameDex }): number {
  return DEX_DATA[gameDex].pokemonIds.length;
}

/**
 * Returns full info for a game dex.
 */
export function getDexInfo({ gameDex }: { gameDex: GameDex }): DexInfo {
  const data = DEX_DATA[gameDex];
  return {
    gameDex,
    game: data.game,
    gameDisplayName: data.gameDisplayName,
    dexDisplayName: data.dexDisplayName,
    pokemonIds: data.pokemonIds,
  };
}

/**
 * Returns all available games.
 */
export function getAllGames(): Game[] {
  return Object.values(Game);
}

/**
 * Returns all game dexes.
 */
export function getAllGameDexes(): GameDex[] {
  return Object.values(GameDex);
}

/**
 * Returns all dexes for a given game.
 */
export function getDexesForGame({ game }: { game: Game }): GameDex[] {
  return GAME_DEXES[game];
}

/**
 * Returns the default dex for a game (first dex).
 */
export function getDefaultDex({ game }: { game: Game }): GameDex {
  return GAME_DEXES[game][0];
}

/**
 * Returns the game for a given game dex.
 */
export function getGameForDex({ gameDex }: { gameDex: GameDex }): Game {
  return DEX_DATA[gameDex].game;
}

/**
 * Returns full game info including all dexes.
 */
export function getGameInfo({ game }: { game: Game }): GameInfo {
  return {
    game,
    displayName: DEX_DATA[GAME_DEXES[game][0]].gameDisplayName,
    dexes: GAME_DEXES[game],
  };
}

/**
 * Returns info for all games.
 */
export function getAllGamesInfo(): GameInfo[] {
  return getAllGames().map((game) => getGameInfo({ game }));
}

/**
 * Returns the display name for a game.
 */
export function getGameDisplayName({ game }: { game: Game }): string {
  return DEX_DATA[GAME_DEXES[game][0]].gameDisplayName;
}

/**
 * Returns the display name for a dex.
 */
export function getDexDisplayName({ gameDex }: { gameDex: GameDex }): string {
  return DEX_DATA[gameDex].dexDisplayName;
}

/**
 * Returns a formatted label combining game abbreviation and dex name.
 * Example: "SV • Paldea Dex"
 */
export function getDexLabel({ gameDex }: { gameDex: GameDex }): string {
  const data = DEX_DATA[gameDex];
  return `${data.game} • ${data.dexDisplayName}`;
}
