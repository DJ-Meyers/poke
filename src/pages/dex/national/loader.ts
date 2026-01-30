/**
 * Loader for the National Dex page.
 * Prefetches Pokemon data for all Pokemon in the national dex.
 */

import { getNationalDexPokemonIds } from '~/utils/national-dex';
import { prefetchGetPokemonById } from '~/data/pokemon';

export const nationalDexLoader = () => {
  const pokemonIds = getNationalDexPokemonIds();
  for (const id of pokemonIds) {
    prefetchGetPokemonById({ id });
  }
  return null;
};
