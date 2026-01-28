/**
 * Loader for the DexDetailPage route.
 * Validates that the dexId param is valid for the given game.
 * Prefetches Pokemon data for all entries in the dex.
 */

import { redirect, type LoaderFunctionArgs } from 'react-router';
import { getPokemonIdsForDex } from '~/utils/dex-data';
import {
  parseGameParam,
  parseDexParam,
  getDefaultDexUrlId,
} from '~/utils/route-params';
import { prefetchGetPokemonById } from '~/data/pokemon';

export function dexDetailLoader({ params }: LoaderFunctionArgs) {
  const { gameId, dexId } = params;

  // Parse and validate game param
  const game = gameId ? parseGameParam({ gameId }) : undefined;

  if (!game) {
    // Invalid game ID, redirect to games list
    return redirect('/dex');
  }

  if (!dexId) {
    // No dex ID provided, redirect to game page
    return redirect(`/dex/${gameId}`);
  }

  // Parse and validate dex param
  const gameDex = parseDexParam({ game, dexId });

  if (!gameDex) {
    // Invalid dex ID, redirect to default dex
    const defaultDexUrl = getDefaultDexUrlId({ game });
    return redirect(`/dex/${gameId}/${defaultDexUrl}`);
  }

  // Fire-and-forget prefetch for all Pokemon in the dex
  const pokemonIds = getPokemonIdsForDex({ gameDex });
  for (const id of pokemonIds) {
    prefetchGetPokemonById({ id });
  }

  return null;
}
