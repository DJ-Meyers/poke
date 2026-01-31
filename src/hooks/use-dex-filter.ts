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
 * Checks if a number matches the query based on the matching mode.
 *
 * - Leading zeros in query (e.g., "001", "0025"): EXACT match
 *   The query represents a specific number (leading zeros stripped)
 * - No leading zeros (e.g., "1", "25"): PREFIX match
 *   Match any number whose string representation starts with the query
 */
const matchesNumber = (num: number, query: string): boolean => {
  const hasLeadingZero = query.startsWith('0');

  if (hasLeadingZero) {
    // Exact match: "001" matches only 1, "0025" matches only 25
    const targetNumber = parseInt(query, 10);
    return num === targetNumber;
  } else {
    // Prefix match: "1" matches 1, 10-19, 100-199, etc.
    return String(num).startsWith(query);
  }
};

/**
 * Filters a dex's Pokemon list by search query and completion status.
 *
 * - Name match: case-insensitive substring against the Pokemon name
 * - Number match: if the query is numeric (or starts with #), matches
 *   against BOTH the 1-indexed game dex position AND the national dex ID.
 *   - Leading zeros = exact match: "001" matches only #1, "0025" matches only #25
 *   - No leading zeros = prefix match: "1" matches 1, 10-19, 100-199, etc.
 * - Hide completed: removes entries where caughtIds contains the ID
 *
 * Returns filteredIds and a dexNumberMap so the grid can display the
 * original dex number even after filtering.
 */
export const filterDexEntries = ({
  pokemonIds,
  caughtIds,
  searchQuery,
  hideCompleted,
}: UseDexFilterParams): UseDexFilterResult => {
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
        // Match against BOTH game dex position AND national dex ID
        // Numbers are padded to 4 digits and matched as substrings
        const matchesPosition = matchesNumber(dexNumber, numericQuery);
        const matchesNationalId = matchesNumber(id, numericQuery);
        if (!matchesPosition && !matchesNationalId) continue;
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
};

export const useDexFilter = (
  params: UseDexFilterParams
): UseDexFilterResult => {
  return useMemo(() => filterDexEntries(params), [params]);
};
