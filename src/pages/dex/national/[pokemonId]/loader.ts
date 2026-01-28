/**
 * Loader for the National Dex entry detail page.
 * Validates the pokemonId param and ensures Pokemon data is cached.
 */

import { redirect, type LoaderFunctionArgs } from 'react-router';
import { getNationalDexPokemonIds } from '~/utils/national-dex';
import {
  ensureGetPokemonById,
  prefetchGetPokemonSpeciesById,
} from '~/data/pokemon';

export async function nationalDexEntryDetailLoader({
  params,
}: LoaderFunctionArgs) {
  const { pokemonId: pokemonIdParam } = params;

  const parsed = pokemonIdParam ? parseInt(pokemonIdParam, 10) : NaN;
  if (isNaN(parsed) || parsed <= 0) {
    return redirect('/dex/national');
  }

  // Validate that the Pokemon is in the national dex
  const pokemonIds = getNationalDexPokemonIds();
  if (!pokemonIds.includes(parsed)) {
    return redirect('/dex/national');
  }

  // Ensure Pokemon data is cached before page renders
  try {
    await ensureGetPokemonById({ id: parsed });
  } catch {
    return redirect('/dex/national');
  }

  // Species is non-critical — fire-and-forget prefetch
  prefetchGetPokemonSpeciesById({ id: parsed });

  return null;
}
