/**
 * Utilities for the National Dex - aggregating all Pokémon across all games.
 */

/** Total number of Pokémon through Gen 9. */
export const NATIONAL_DEX_TOTAL = 1025;

/**
 * Returns all Pokémon IDs in the National Dex (1–1025), sorted numerically.
 */
export function getNationalDexPokemonIds(): number[] {
  return Array.from({ length: NATIONAL_DEX_TOTAL }, (_, i) => i + 1);
}

/**
 * Returns the total count of Pokémon in the National Dex.
 */
export function getNationalDexSize(): number {
  return NATIONAL_DEX_TOTAL;
}
