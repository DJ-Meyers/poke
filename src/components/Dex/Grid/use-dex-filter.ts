import { useMemo } from 'react';
import { getPokemonName } from '~/utils/pokemon-names';

export interface UseDexFilterParams {
  pokemonIds: number[];
  caughtIds: Set<number>;
  searchQuery: string;
  hideCompleted: boolean;
}

export interface UseDexFilterResult {
  filteredIds: number[];
  dexNumberMap: Map<number, number>;
}

/**
 * Filters a dex's Pokemon list by search query and completion status.
 *
 * - Name match: case-insensitive substring against the Pokemon name
 * - Number match: if the query is numeric (or starts with #), matches
 *   against the 1-indexed dex position
 * - Hide completed: removes entries where caughtIds contains the ID
 *
 * Returns filteredIds and a dexNumberMap so the grid can display the
 * original dex number even after filtering.
 */
export function filterDexEntries({
  pokemonIds,
  caughtIds,
  searchQuery,
  hideCompleted,
}: UseDexFilterParams): UseDexFilterResult {
  const query = searchQuery.trim().toLowerCase();
  const isActive = query.length > 0 || hideCompleted;

  if (!isActive) {
    // No filtering — build identity dex number map
    const dexNumberMap = new Map<number, number>();
    for (let i = 0; i < pokemonIds.length; i++) {
      dexNumberMap.set(pokemonIds[i], i + 1);
    }
    return { filteredIds: pokemonIds, dexNumberMap };
  }

  // Determine if query is a number search (e.g. "25" or "#25")
  const numericQuery = query.startsWith('#') ? query.slice(1) : query;
  const isNumberSearch = /^\d+$/.test(numericQuery);

  const filteredIds: number[] = [];
  const dexNumberMap = new Map<number, number>();

  for (let i = 0; i < pokemonIds.length; i++) {
    const id = pokemonIds[i];
    const dexNumber = i + 1;

    // Hide completed filter
    if (hideCompleted && caughtIds.has(id)) continue;

    // Search query filter
    if (query.length > 0) {
      if (isNumberSearch) {
        // Match against dex position (1-indexed)
        const dexStr = String(dexNumber);
        if (!dexStr.startsWith(numericQuery)) continue;
      } else {
        // Match against Pokemon name
        const name = getPokemonName(id);
        if (!name.includes(query)) continue;
      }
    }

    filteredIds.push(id);
    dexNumberMap.set(id, dexNumber);
  }

  return { filteredIds, dexNumberMap };
}

export function useDexFilter(params: UseDexFilterParams): UseDexFilterResult {
  return useMemo(() => filterDexEntries(params), [params]);
}
