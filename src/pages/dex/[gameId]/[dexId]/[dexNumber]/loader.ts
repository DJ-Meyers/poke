/**
 * Loader for the DexEntryDetail page.
 * Validates gameId, dexId, and dexNumber params.
 * dexNumber should be a national dex number, with or without leading zeros.
 * Ensures Pokemon data is cached before the page renders.
 */

import { redirect, type LoaderFunctionArgs } from 'react-router';
import { getPokemonIdsForDex } from '~/utils/dex-data';
import {
  parseGameParam,
  parseDexParam,
  getDefaultDexUrlId,
} from '~/utils/route-params';
import {
  ensureGetPokemonById,
  prefetchGetPokemonSpeciesById,
} from '~/data/pokemon';

/**
 * Parses the dex number param, handling leading zeros.
 * Returns undefined if the param is not a valid number.
 */
const parseDexNumber = (dexNumber: string | undefined): number | undefined => {
  if (!dexNumber) {
    return undefined;
  }
  const parsed = parseInt(dexNumber, 10);
  return isNaN(parsed) || parsed <= 0 ? undefined : parsed;
};

export const dexEntryDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  const { gameId, dexId, dexNumber } = params;

  // Parse and validate game param
  const game = gameId ? parseGameParam({ gameId }) : undefined;

  if (!game) {
    return redirect('/dex');
  }

  if (!dexId) {
    return redirect(`/dex/${gameId}`);
  }

  // Parse and validate dex param
  const gameDex = parseDexParam({ game, dexId });

  if (!gameDex) {
    const defaultDexUrl = getDefaultDexUrlId({ game });
    return redirect(`/dex/${gameId}/${defaultDexUrl}`);
  }

  // Parse and validate dex number
  const pokemonId = parseDexNumber(dexNumber);

  if (!pokemonId) {
    // Invalid dex number, redirect back to dex page
    return redirect(`/dex/${gameId}/${dexId}`);
  }

  // Validate that the Pokemon is in this dex
  const pokemonIds = getPokemonIdsForDex({ gameDex });
  const regionalDexIndex = pokemonIds.indexOf(pokemonId);
  if (regionalDexIndex === -1) {
    // Pokemon not in this dex, redirect back to dex page
    return redirect(`/dex/${gameId}/${dexId}`);
  }

  // Ensure Pokemon data is cached before page renders
  try {
    await ensureGetPokemonById({ id: pokemonId });
  } catch {
    // Pokemon fetch failed — redirect back to dex page
    return redirect(`/dex/${gameId}/${dexId}`);
  }

  // Species is non-critical — fire-and-forget prefetch
  prefetchGetPokemonSpeciesById({ id: pokemonId });

  return null;
};
