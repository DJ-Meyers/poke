/**
 * Utilities for parsing and validating route parameters.
 */

import { useParams } from 'react-router';
import {
  Game,
  GameDex,
  getDexesForGame,
  getDefaultDex,
  getPokemonIdsForDex,
} from './dex-data';

/**
 * Parses a game ID from a URL parameter (case-insensitive).
 * Returns undefined if the game ID is not valid.
 */
export const parseGameParam = ({
  gameId,
}: {
  gameId: string;
}): Game | undefined => {
  const normalized = gameId.toUpperCase();
  const games = Object.values(Game);
  return games.find((game) => game.toUpperCase() === normalized);
};

/**
 * Parses a dex ID from a URL parameter for a specific game.
 * Returns undefined if the dex ID is not valid for the game.
 */
export const parseDexParam = ({
  game,
  dexId,
}: {
  game: Game;
  dexId: string;
}): GameDex | undefined => {
  const normalized = dexId.toLowerCase();
  const dexes = getDexesForGame({ game });

  // Match by the dex portion of the GameDex value (after the underscore)
  return dexes.find((gameDex) => {
    const dexPart = gameDex.split('_').slice(1).join('_').toLowerCase();
    return dexPart === normalized;
  });
};

/**
 * Gets the URL-friendly dex ID from a GameDex value.
 * E.g., 'SV_PALDEA' -> 'paldea'
 */
export const getDexUrlId = ({ gameDex }: { gameDex: GameDex }): string => {
  return gameDex.split('_').slice(1).join('_').toLowerCase();
};

/**
 * Gets the default dex URL ID for a game.
 */
export const getDefaultDexUrlId = ({ game }: { game: Game }): string => {
  const defaultDex = getDefaultDex({ game });
  return getDexUrlId({ gameDex: defaultDex });
};

// --- Route param hooks (safe to call after loader has validated) ---

/**
 * Reads and parses the :gameId URL param.
 * Throws if the param is missing or invalid.
 * Safe to call in components whose loader already validated.
 */
export const useGameParam = (): Game => {
  const { gameId } = useParams();
  const game = gameId ? parseGameParam({ gameId }) : undefined;
  if (!game) {
    throw new Error(`Invalid game param: ${gameId}`);
  }
  return game;
};

/**
 * Reads and parses the :gameId and :dexId URL params.
 * Throws if either param is missing or invalid.
 */
export const useGameDexParams = (): { game: Game; gameDex: GameDex } => {
  const game = useGameParam();
  const { dexId } = useParams();
  const gameDex = dexId ? parseDexParam({ game, dexId }) : undefined;
  if (!gameDex) {
    throw new Error(`Invalid dex param: ${dexId}`);
  }
  return { game, gameDex };
};

/**
 * Reads and parses the :gameId, :dexId, and :dexNumber URL params.
 * Throws if any param is missing or invalid.
 */
export const useDexEntryParams = (): {
  game: Game;
  gameDex: GameDex;
  pokemonId: number;
  regionalDexNumber: number;
} => {
  const { game, gameDex } = useGameDexParams();
  const { dexNumber } = useParams();
  if (!dexNumber) {
    throw new Error('Missing dexNumber param');
  }
  const pokemonId = parseInt(dexNumber, 10);
  if (isNaN(pokemonId) || pokemonId <= 0) {
    throw new Error(`Invalid dexNumber param: ${dexNumber}`);
  }
  const pokemonIds = getPokemonIdsForDex({ gameDex });
  const regionalDexNumber = pokemonIds.indexOf(pokemonId) + 1;
  return { game, gameDex, pokemonId, regionalDexNumber };
};
